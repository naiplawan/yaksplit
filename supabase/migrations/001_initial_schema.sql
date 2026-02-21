-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE,
  promptpay_id VARCHAR(13),
  display_name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
  share_code VARCHAR(10) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Event members
CREATE TABLE event_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  nickname VARCHAR(100) NOT NULL,
  promptpay_id VARCHAR(13),
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('creator', 'admin', 'member')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'THB',
  payer_member_id UUID REFERENCES event_members(id),
  receipt_image_url TEXT,
  expense_date DATE DEFAULT CURRENT_DATE,
  split_type VARCHAR(20) DEFAULT 'equal' CHECK (split_type IN ('equal', 'custom', 'percentage')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Splits table
CREATE TABLE splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  member_id UUID REFERENCES event_members(id) ON DELETE CASCADE,
  amount_owed DECIMAL(12,2) NOT NULL,
  amount_paid DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(expense_id, member_id)
);

-- Payments log
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id UUID REFERENCES splits(id) ON DELETE CASCADE,
  from_member_id UUID REFERENCES event_members(id),
  to_member_id UUID REFERENCES event_members(id),
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(20) CHECK (payment_method IN ('promptpay', 'cash', 'transfer', 'other')),
  reference_id TEXT,
  paid_at TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT false
);

-- Friendships
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nickname VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Indexes for performance
CREATE INDEX idx_events_creator ON events(creator_id);
CREATE INDEX idx_events_share_code ON events(share_code);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_event_members_event ON event_members(event_id);
CREATE INDEX idx_event_members_user ON event_members(user_id);
CREATE INDEX idx_expenses_event ON expenses(event_id);
CREATE INDEX idx_expenses_payer ON expenses(payer_member_id);
CREATE INDEX idx_splits_expense ON splits(expense_id);
CREATE INDEX idx_splits_member ON splits(member_id);
CREATE INDEX idx_splits_status ON splits(status);
CREATE INDEX idx_payments_split ON payments(split_id);
CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);

-- Function to generate share code
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_splits_updated_at BEFORE UPDATE ON splits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically add creator as event member
CREATE OR REPLACE FUNCTION add_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO event_members (event_id, user_id, nickname, role)
  VALUES (
    NEW.id,
    NEW.creator_id,
    COALESCE((SELECT display_name FROM users WHERE id = NEW.creator_id), 'Creator'),
    'creator'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_creator_member_trigger AFTER INSERT ON events
  FOR EACH ROW EXECUTE FUNCTION add_creator_as_member();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Events policies
CREATE POLICY "Anyone can view events they are members of" ON events
  FOR SELECT USING (
    id IN (
      SELECT event_id FROM event_members
      WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid()::text = creator_id::text);

CREATE POLICY "Creators can update their events" ON events
  FOR UPDATE USING (auth.uid()::text = creator_id::text);

CREATE POLICY "Creators can delete their events" ON events
  FOR DELETE USING (auth.uid()::text = creator_id::text);

-- Event members policies
CREATE POLICY "Members can view event members" ON event_members
  FOR SELECT USING (
    event_id IN (
      SELECT event_id FROM event_members
      WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Members can add other members to their events" ON event_members
  FOR INSERT WITH CHECK (
    event_id IN (
      SELECT event_id FROM event_members
      WHERE user_id::text = auth.uid::text AND role IN ('creator', 'admin')
    )
  );

CREATE POLICY "Members can update members in their events" ON event_members
  FOR UPDATE USING (
    event_id IN (
      SELECT event_id FROM event_members
      WHERE user_id::text = auth.uid()::text AND role IN ('creator', 'admin')
    )
  );

CREATE POLICY "Members can delete members from their events" ON event_members
  FOR DELETE USING (
    event_id IN (
      SELECT event_id FROM event_members
      WHERE user_id::text = auth.uid()::text AND role IN ('creator', 'admin')
    )
  );

-- Expenses policies
CREATE POLICY "Members can view event expenses" ON expenses
  FOR SELECT USING (
    event_id IN (
      SELECT event_id FROM event_members
      WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Members can create expenses in their events" ON expenses
  FOR INSERT WITH CHECK (
    event_id IN (
      SELECT event_id FROM event_members
      WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Members can update expenses in their events" ON expenses
  FOR UPDATE USING (
    event_id IN (
      SELECT event_id FROM event_members
      WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Members can delete expenses in their events" ON expenses
  FOR DELETE USING (
    event_id IN (
      SELECT event_id FROM event_members
      WHERE user_id::text = auth.uid()::text
    )
  );

-- Splits policies
CREATE POLICY "Members can view splits for their event expenses" ON splits
  FOR SELECT USING (
    expense_id IN (
      SELECT id FROM expenses
      WHERE event_id IN (
        SELECT event_id FROM event_members
        WHERE user_id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Members can update their own splits" ON splits
  FOR UPDATE USING (
    member_id IN (
      SELECT id FROM event_members
      WHERE user_id::text = auth.uid()::text
    )
  );

-- Payments policies
CREATE POLICY "Members can view payments for their splits" ON payments
  FOR SELECT USING (
    split_id IN (
      SELECT id FROM splits
      WHERE member_id IN (
        SELECT id FROM event_members
        WHERE user_id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Members can create payments" ON payments
  FOR INSERT WITH CHECK (
    from_member_id IN (
      SELECT id FROM event_members
      WHERE user_id::text = auth.uid()::text
    )
  );

-- Friendships policies
CREATE POLICY "Users can view their own friendships" ON friendships
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can create friendships" ON friendships
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their friendships" ON friendships
  FOR DELETE USING (user_id::text = auth.uid()::text);

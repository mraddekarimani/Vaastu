/*
  # Create floor plans table

  1. New Tables
    - `floor_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `width` (integer)
      - `length` (integer)
      - `total_area` (integer)
      - `rooms` (jsonb)
      - `description` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `floor_plans` table
    - Add policies for:
      - Users can view their own floor plans
      - Users can create floor plans
      - Users can update their own floor plans
      - Users can delete their own floor plans
*/

CREATE TABLE IF NOT EXISTS public.floor_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    width integer NOT NULL,
    length integer NOT NULL,
    total_area integer NOT NULL,
    rooms jsonb NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.floor_plans ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT
CREATE POLICY "Users can view their own floor plans"
    ON public.floor_plans
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for INSERT
CREATE POLICY "Users can create floor plans"
    ON public.floor_plans
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE
CREATE POLICY "Users can update their own floor plans"
    ON public.floor_plans
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy for DELETE
CREATE POLICY "Users can delete their own floor plans"
    ON public.floor_plans
    FOR DELETE
    USING (auth.uid() = user_id);
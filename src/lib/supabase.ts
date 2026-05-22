import { createClient } from "@supabase/supabase-js";

// Environment variables for Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mqkdxtlgdvkxpzefponn.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2R4dGxnZHZreHB6ZWZwb25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzMwMTQsImV4cCI6MjA5NDkwOTAxNH0.GkR9KG-amLt-IZ3dwKA1Eur43ZhdqF-PoKUSRLIko0E";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Bankroll {
  id: string;
  user_id: string;
  total_amount: number;
  unit_size: number;
  current_amount: number;
  daily_risk_percent: number;
  created_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  match_id: string;
  tournament: string;
  player1: string;
  player2: string;
  underdog: string;
  odds: number;
  edge_percent: number;
  confidence: string;
  suggested_units: number;
  status: string;
  result?: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  tournament: string;
  player1: string;
  player2: string;
  underdog: string;
  odds: number;
  units: number;
  stake_amount: number;
  edge_percent: number;
  confidence: string;
  result: string;
  profit_loss: number;
  notes?: string;
  created_at: string;
}

// Database operations
export async function saveJournalEntry(entry: Omit<JournalEntry, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([entry])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getJournalEntries(limit = 50) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

export async function saveBankroll(bankroll: Omit<Bankroll, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('bankroll')
    .upsert([bankroll])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getBankroll() {
  const { data, error } = await supabase
    .from('bankroll')
    .select('*')
    .limit(1)
    .single();
  
  if (error) return null;
  return data;
}

export async function savePrediction(prediction: Omit<Prediction, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('predictions')
    .insert([prediction])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getPredictions(limit = 50) {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

export async function updatePredictionResult(id: string, result: string, profitLoss: number) {
  const { data, error } = await supabase
    .from('predictions')
    .update({ status: 'settled', result })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getStats() {
  const entries = await getJournalEntries(500);
  
  const total = entries.length;
  const won = entries.filter(e => e.result === 'won').length;
  const lost = entries.filter(e => e.result === 'lost').length;
  const profitLoss = entries.reduce((sum, e) => sum + (e.profit_loss || 0), 0);
  const winRate = total > 0 ? (won / total) * 100 : 0;
  
  return { total, won, lost, profitLoss, winRate };
}
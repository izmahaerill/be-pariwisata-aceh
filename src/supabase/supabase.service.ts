import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
@Injectable()
export class SupabaseService {
  private PROJECT_URL = 'https://ovcoqwgvijluamthxegs.supabase.co';
  private API_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92Y29xd2d2aWpsdWFtdGh4ZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY3MTA3NDYsImV4cCI6MjAzMjI4Njc0Nn0.pa96koKDy2m_YzCn60Cy_b9vQGbZR-DeTsTtvB0opL0';
  supabase = createClient(this.PROJECT_URL, this.API_KEY);
}

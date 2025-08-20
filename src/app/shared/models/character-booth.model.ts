export interface TavernCardV1 {
  name: string;
  description: string;
  personality?: string;
  scenario: string;
  first_mes: string;
  mes_example: string;
}

export interface TavernCardV2 {
  spec: 'chara_card_v2';
  spec_version?: string;
  data: TavernCardV1 & {
    creator_notes?: string;
    system_prompt?: string;
    post_history_instructions?: string;
    alternate_greetings?: string[];
    tags?: string[];
    creator?: string;
    character_version?: string;
    character_book?: unknown;
    extensions?: Record<string, unknown>;
  };
}

export interface CharacterBoothModel {
  name: string;
  avatarUrl: string; // object URL for uploaded file
  description: string;
  scenario?: string;
  greeting?: string;
  examples?: string;
  systemPrompt?: string;
  postHistory?: string;
  tags?: string[];
  creator?: string;
  version?: string;
  rawCard: TavernCardV1 | TavernCardV2;
}

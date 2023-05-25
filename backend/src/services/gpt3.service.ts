import { formatArray } from '@/utils/formatRules';
import { Injectable } from '@nestjs/common';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

@Injectable()
export class Gpt3Service {
  private api: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.api = new OpenAIApi(configuration);
  }

  async judgeComment(comment: string, rules: string[], maxTokens = 10) {
    const prompt = `You are judge who decides if the text follows the rules. You reply with "yes" or "no, #".
Example:
1 cant say the letter q
2 you cant swear
text: what the fuck
judge: no, 2
Example:
1 you must use the word blue
2 may not use the letter o
text: bananas are blue
judge: yes
Now you try:
${formatArray(rules)}`;
    const messages: ChatCompletionRequestMessage[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: comment },
    ];

    try {
      const completion = await this.api.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0,
        max_tokens: 10,
        top_p: 0.13,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log(completion.data.choices[0].message);
      return completion.data.choices[0].message.content;
    } catch (error) {
      console.log(error);
      return 'Yes';
    }
  }
}

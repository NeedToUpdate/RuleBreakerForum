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
    const prompt = `You are judge who decides if the text follows the rules. You must reply with 'yes' if all rules are followed, and if any rules are broken, you must say 'no" and the number of the rule that was broken
Example:
1 you must be mean
2 talk about animals
text: giraffes are dumb.
judge: yes
Example:
1 you must use the word blue
2 may not use the letter o
text: bananas are yellow
judge: no, 1
Example:
1 cant say the letter q
2 you must be nice
3 you cant swear
text: this is very pretty
judge: yes
Example:
1 cant say the letter q
2 you must be nice
3 you cant swear
text: what the fuck
judge: no, 3
${formatArray(rules)}`;
    const messages: ChatCompletionRequestMessage[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: comment },
    ];

    try {
      const completion = await this.api.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 1,
        max_tokens: 10,
        top_p: 1,
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

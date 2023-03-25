import { openAiApiKey } from './config';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: openAiApiKey,
});

const openai = new OpenAIApi(configuration);

const tpl = `Given some keywords, generate a funny meme caption

Keywords: leopard, baseball, duck
Caption: When you're playing baseball and suddenly a leopard shows up, but then you realize it's just a duck in a leopard costume.
Keywords: printer, bread, phd
Caption: When you finally get your PhD in computer science but your printer only prints bread recipes.
Keywords: sky
Caption: How it feels to stare at the sky hoping to see a shooting star, but all you see is a pigeon flying by.
Keywords: sky, rocket, trump, bezos, crash
Caption: When you give Trump and Bezos a rocket each to see who reaches the sky first, but they both crash and burn.
Keywords: cat, japanese, cute
Caption: When you try to imitate the cute Japanese cat videos but end up scaring your own cat instead.
Keywords: {tags}
Caption: `;

export async function generateMemeCaption({ name, tags }: { name: string; tags: string[] }): Promise<string> {
    try {
        const completion = await openai.createCompletion({
            model: 'text-babbage-001',
            prompt: tpl.replace('{tags}', tags.join(', ')),
            frequency_penalty: 1,
            presence_penalty: 0.0,
            top_p: 0.1,
            max_tokens: 100,
        });

        return completion.data.choices[0].text?.trim() ?? '';
    } catch (e: any) {
        throw e.toString();
    }
}

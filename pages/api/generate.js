import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = "Write me a pitch to a VC for a startup that \
    includes the problem it's solving, the solution, market size, and \
    the business plan. This startup is: ";
const generateAction = async (req, res) => {
  // https://beta.openai.com/docs/api-reference/completions/create?utm_source=buildspace.so&utm_medium=buildspace_project
  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003', // model type
    prompt: `${basePromptPrefix}${req.body.userInput}`, // prompt we're passing
    temperature: 0.8,
    max_tokens: 300, // about 1200 characters total
  });
  const basePromptOutput = baseCompletion.data.choices.pop();

  // prompt chaining
  const secondPrompt = `Given the startup idea and sample VC pitch below, 
    write me a longer, more detailed pitch, using more statistics and 
    referring to figures.

    Startup idea: ${req.body.userInput}
  
    Pitch: ${basePromptOutput.text}

    New pitch: 
  `;

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    temperature: 0.85,
    max_tokens: 500,
  });
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
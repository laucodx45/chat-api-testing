import { configDotenv } from "dotenv";
import OpenAIApi from "openai";
import 'dotenv/config'

const openai = new OpenAIApi({
  apiKey: process.env.apiKey
}); 

const commandLineInput = process.argv.slice(2)

const helper = (array) => {
  const result = array.join(' ')
  return result;
}

const userInput = helper(commandLineInput);

// use this example JSON in system prompt to make sure it returns the JSON format we want
const exampleJson = {
  "recipe": {
    "title": "Chicken Broccoli Stir-Fry with Rice",
    "cuisine": "Asian",
    "ingredients": ["1 lb chicken breast", "2 cups broccoli florets", "2 cups cooked rice"],
    "steps": ["Heat oil, cook chicken", "Add garlic, ginger", "Add broccoli", "Mix sauces", "Season", "Serve with rice", "Garnish and enjoy!"]
  }
}
const recipeSystemPrompt = `Provide Valid JSON format response. Create a recipe based on user's prompt. 
It should include the title of the recipe, ingredients that it needs, 
what type of cuisine it is and the steps that are required to make it. 
The data schema should follow this example \`${JSON.stringify(exampleJson)}\``


async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: recipeSystemPrompt},
      { role: "user", content: userInput}
  ],
    response_format : { type: "json_object" },
    model: "gpt-3.5-turbo",
  });

  // turn String JSON response into object
  const response = JSON.parse(completion.choices[0].message.content)
  console.log(response);
  
}

main();
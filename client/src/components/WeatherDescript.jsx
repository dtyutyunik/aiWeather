import PropTypes from "prop-types";

const WeatherDescript = (prompt, weatherData) => {
  const url = "https://api.openai.com/v1/chat/completions";
  const openAi = process.env.REACT_APP_OPENAI;

  const sysMsg = `In a conversational professional tone, answer the [Question] based on the [Weather Data]. 

- Provide an opinion about what the weather feels like. 
- Temperature should be provided in Celsius if country is not US, otherwise in Fahrenheit
- Never display the temperature in Kelvin. 
- Provide a recommendation on how to prepare and what to wear (e.g. bring an umbrella, wear a wind breaker, a warm jacket, etc.) but 4 sentences max`;

  const newPrompt = `Question: ${prompt}. Weather Data: ${JSON.stringify(
    weatherData
  )}`;

  const data = {
    model: "gpt-4-0613",
    messages: [
      { role: "system", content: sysMsg },
      { role: "user", content: newPrompt },
    ],
  };

  const params = {
    headers: {
      Authorization: `Bearer ${openAi}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    method: "POST",
  };

  return fetch(url, params)
    .then((response) => response.json())
    .then((data) => {
      return data?.choices[0]?.message?.content;
    })
    .catch((error) => {
      return Promise.reject("Unable to fetch weather description.");
    });
};

WeatherDescript.propTypes = {
  prompt: PropTypes.string.isRequired,
};

export default WeatherDescript;

import PropTypes from "prop-types";

const PromptToLocation = (prompt) => {
  const openAi = process.env.REACT_APP_OPENAI;
  const url = "https://api.openai.com/v1/chat/completions";

  const data = {
    model: "gpt-3.5-turbo-0613",
    messages: [{ role: "user", content: prompt }],
    functions: [
      {
        name: "displayData",
        description: "Get the current weather in a given location.",
        parameters: {
          type: "object",
          properties: {
            country: {
              type: "string",
              description: "Country name.",
            },
            countryCode: {
              type: "string",
              description: "Country code. Use ISO-3166",
            },
            USstate: {
              type: "string",
              description: "Full state name.",
            },
            state: {
              type: "string",
              description: "Two-letter state code.",
            },
            city: {
              type: "string",
              description: "City name.",
            },
            unit: {
              type: "string",
              description: "location unit: metric or imperial.",
            },
          },
          required: [
            "countryCode",
            "country",
            "USstate",
            "state",
            "city",
            "unit",
          ],
        },
      },
    ],
    function_call: "auto", //if called then u can use it or not
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
      // Check if the response includes the expected data
      if (
        !data.choices[0].message.function_call ||
        !data.choices[0].message.function_call.arguments
      ) {
        // If not, return a message indicating only weather information can be retrieved
        return Promise.reject("Sorry, can only show weather information.");
      }

      const promptRes = JSON.parse(
        data.choices[0].message.function_call.arguments
      );

      const { city, state, country, USstate, countryCode } = promptRes;

      const locationString = () => {
        if (countryCode === "US") {
          return `${city},${state},${country}`;
        } else {
          return `${city},${country}`;
        }
      };

      const promptData = {
        locationString: locationString(),
        units: countryCode === "US" ? "imperial" : "metric",
        country,
        USstate,
      };

      return promptData;
    })
    .catch((error) => {
      return Promise.reject(
        "Unable to identify a location from your question. Please try again."
      );
    });
};

PromptToLocation.propTypes = {
  prompt: PropTypes.string.isRequired,
};

export default PromptToLocation;

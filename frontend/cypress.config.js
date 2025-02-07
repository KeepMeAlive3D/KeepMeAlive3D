import { defineConfig } from "cypress";
import axios from "axios";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Note: this is not run if 'npx cypress open' mode is used.
      on("before:run", (details) => {
        const options = {
          method: "POST",
          url: "http://localhost:8080/api/register/basic",
          headers: { "Content-Type": "application/json" },
          data: { username: "tester", password: "123" },
        };
        console.log("Running REGISTER");
        axios
          .request(options)
          .then(function(response) {
            console.log(response.data);
          })
          .catch(function(error) {
            console.error(error);
          });
      });
    },
  },
});

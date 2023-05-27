# RuleBreaker Forums

This is a fun little forum where chatGPT is the moderator. You can create posts with custom rules, and comment on those posts. ChatGPT will decide whether or not to ban the user from that post based on the rules.

This is a small distributed micro-service-ish setup. There is a Next.js frontend, which does server side rendering and prefetching, a Nest.js backend, an OAuth authentication service, and a MongoDB database.

---

## Setup

### Environment Variables

This project makes use of environment variables for configuration. In each of the following directories:

- frontend
- backend
- database
- auth

You'll find a `.env.example` file. For each of these, create a corresponding `.env` file with the same keys. You will need to populate these keys with the appropriate values.

#### Backend

The backend requires an OpenAI API key. Instructions on how to obtain this key can be found [here](https://beta.openai.com/docs/developer-quickstart/your-api-keys/).

#### Auth

The Auth service requires a Google OAuth API ID and Secret. Instructions on how to get these can be found [here](https://developers.google.com/identity/protocols/oauth2).

It also requires a GitHub OAuth API ID and Secret. Instructions on how to get these can be found [here](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app).

### Running the Project

Once you have configured your `.env` files, you can start the project by running the following command in the root directory:

```bash
docker-compose up
```

### Development

If you wish to edit or develop your own parts of the project, you'll need to install npm packages locally in the respective folder you want to edit. Run the following command:

```bash
npm install
```

## License

This project is licensed under the MIT license. For more information, see [LICENSE](LICENSE).

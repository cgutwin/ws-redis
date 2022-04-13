export const env = {
  PORT: process.env.PORT as unknown as number,
  redis: {
    HOST: process.env.REDIS_HOST as unknown as string,
    PORT: process.env.REDIS_PORT as unknown as number
  }
}

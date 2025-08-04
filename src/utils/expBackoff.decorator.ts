const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ExponentialBackoff = (
  maxRetries = 5,
  initialDelay = 100,
) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let retries = 0;
      let currentDelay = initialDelay;

      while (retries < maxRetries) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          console.error(
            `Method "${key}" failed. Retrying in ${currentDelay}ms... (Attempt ${
              retries + 1
            }/${maxRetries})`,
          );
          console.error(error.message);

          await delay(currentDelay);
          currentDelay *= 2; 
          retries++;
        }
      }

      console.error(
        `Method "${key}" failed after ${maxRetries} attempts. Giving up.`,
      );
      throw new Error(
        `Operation failed after ${maxRetries} retries: ${
          originalMethod.name
        } with error: ${originalMethod.error}`,
      );
    };

    return descriptor;
  };
};
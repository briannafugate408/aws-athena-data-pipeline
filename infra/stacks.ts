import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

/**
 * Using the stack config, grab the infra-observability/lb-access-logs stack. It uses
 * the current stack as a basis for which environment to pick.
 *
 * @see pulumi.getStack()
 */
export const getAthenaBruteForceStackReference = () => {
    const environmentStackName = `apps/athena-datapipeline/bruteforce`;
    const stackReference = new pulumi.StackReference(environmentStackName);
  
    return stackReference;
  };
  
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
interface Buckets {
    queryAssetsBucket: pulumi.Output<string>;
}

const createInfrastructure = async () => {
    const accountId = "339712892782";

    const queryAssetsBucket = {
        queryAssetsBucket: createBruteForceQueryAssetsBucket(),
    };

    const buckets: Buckets = {
        queryAssetsBucket: queryAssetsBucket.queryAssetsBucket,
    };

    createAccessUser("brute-force-user", buckets);

    return {
        buckets,
        athenaPolicy,
    };
}

const createAccessUser = (
    userName: string,
    buckets: Buckets,
) => {
    const user = new aws.iam.User(`createIamUser-${userName}`, {
        name: userName,
    },
    );

    const userPolicy = new aws.iam.Policy(`userPolicy-${userName}`, {
        name: `${userName}UserPolicy`,
        description: "Policy for Athena and S3 access",
        policy: athenaPolicy(buckets),
    })

    new aws.iam.UserPolicyAttachment(`${userName}UserPolicyAttachment`, {
        user: user.name,
        policyArn: userPolicy.arn,
    });
}

const createBruteForceQueryAssetsBucket = () => {
    const queryAssetsBucketName = `brute-force-bucket-assets`;

    const bucket = new aws.s3.Bucket(queryAssetsBucketName, {
        bucket: queryAssetsBucketName,
        serverSideEncryptionConfiguration: {
            rule: {
                applyServerSideEncryptionByDefault: {
                    sseAlgorithm: "aws:kms",
                },
                bucketKeyEnabled: true,
            },
        },
    });

    return bucket.id;
};

const athenaPolicy = (buckets: Buckets): aws.iam.PolicyDocument => {
    const { queryAssetsBucket } = buckets;

    const bucketArns = [
        pulumi.interpolate`arn:aws:s3:::${queryAssetsBucket}`,
    ];

    return {
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "AthenaFullAccess",
                Effect: "Allow",
                Action: ["athena:*"],
                Resource: ["*"],
            },
            {
                Sid: "S3FullAccess",
                Effect: "Allow",
                Action: ["s3:*"],
                Resource: bucketArns,
              },
        ]
    }
}

export const outputs = createInfrastructure().then((out) => {
    return { ...out };
  });
  
// Create an AWS resource (S3 Bucket)
const bruteforceBucket = new aws.s3.Bucket("brute-force-assets-bucket-assets");

// Export the name of the bucket
export const bucketName = bruteforceBucket.id;

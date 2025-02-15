import { dynamoDB } from '@libs/aws';

export const getItemsByKey = async (paritionKey: string, tableName: string): Promise<any> => {
  const params = {
    TableName: tableName,
    Key: {
      id: paritionKey,
    },
  };

  const result = await dynamoDB.get(params).promise();
  return result.Item;
};

export const putItem = async (item: any, tableName: string): Promise<any> => {
  const params = {
    TableName: tableName,
    Item: item,
  };

  await dynamoDB.put(params).promise();
  return item;
};

export const deleteItem = async (paritionKey: string, tableName: string): Promise<void> => {
  const params = {
    TableName: tableName,
    Key: {
      id: paritionKey,
    },
  };

  await dynamoDB.delete(params).promise();
};

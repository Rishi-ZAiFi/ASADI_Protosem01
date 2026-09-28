
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { MongoClient } from 'mongodb';

export function createCheckpointer(client: MongoClient) {
  return new MongoDBSaver({ client, dbName: 'contentyou_checkpoints' });
}

import { RawData } from 'ws';
import { LoginMessage } from '../types/incoming';

const getResponseFromMessage = (message: RawData) : LoginMessage => {
  const { data: dataMessage, ...rest } = JSON.parse(message.toString());
  console.log('message___', JSON.parse(message.toString()));
  const data = dataMessage === '' ? dataMessage : JSON.parse(dataMessage);

  return {
    data,
    ...rest,
  };
};

export default getResponseFromMessage;

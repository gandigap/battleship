import { RawData } from 'ws';
import { ConvertedMessage } from '../types';

const getResponseFromMessage = (message: RawData) : ConvertedMessage => {
  const { data: dataMessage, ...rest } = JSON.parse(message.toString());
  console.log('dataMessage', dataMessage);
  const data = dataMessage || JSON.parse(dataMessage);

  return {
    data,
    ...rest,
  };
};

export default getResponseFromMessage;

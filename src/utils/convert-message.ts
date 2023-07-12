import { RawData } from 'ws';

const convertMessage = (message: RawData) => {
  const { data: dataMessage, ...rest } = JSON.parse(message.toString());
  const data = dataMessage === '' ? dataMessage : JSON.parse(dataMessage);

  return {
    data,
    ...rest,
  };
};

export default convertMessage;

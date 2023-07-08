import COMMANDS from '../types/commands';
import { OutgoingData } from '../types/outcoming';

const getOutgoingMessage = (type: COMMANDS, data: OutgoingData) => JSON.stringify({
  type,
  data: JSON.stringify(data),
  id: 0,
});

export default getOutgoingMessage;

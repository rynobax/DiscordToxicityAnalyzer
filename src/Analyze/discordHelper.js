const limit = 100;
async function getMessages(channel, n, updateProgress) {
  const messages = [];
  let newMessagesLength;
  let lastMessageId = null;
  do{
    const newMessagesMap = await channel.fetchMessages({limit, before: lastMessageId});
    const newMessages = newMessagesMap.array();
    newMessagesLength = newMessages.length;
    lastMessageId = newMessages[newMessagesLength - 1].id;
    messages.push(...newMessages.map(e => ({
      content: e.content,
      author: e.author.username
    })));
    updateProgress(newMessagesLength);
  } while(newMessagesLength === limit && messages.length < n);
  return messages.splice(0, n);
};

export {getMessages};
function Message({ msg, user }) {
  return (
    <div className={msg.sender===user?"my-msg":"msg"}>
      <b>{msg.sender}</b>: {msg.text}
      <span>{msg.time}</span>
    </div>
  );
}
export default Message;

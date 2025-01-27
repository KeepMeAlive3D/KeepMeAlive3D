import { Message, wsCanceled, wsMessages } from "@/service/wsService.ts";

export async function executeForAllMessages(exec: (event: Message) => void) {
  let canceled = false;
  wsCanceled.receive().then((res) => {
    canceled = res;
  });
  while (!canceled) {
    const result = await wsMessages.receive();
    exec(result);
  }
}

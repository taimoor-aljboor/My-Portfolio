import { redirect } from 'next/navigation';
import { Archive, Mail, Trash2 } from 'lucide-react';
import { auth } from '@/auth';
import type { Message, MessageStatus } from '@prisma/client';
import { MessageStatus as MessageStatusEnum } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { deleteMessage, listMessages, updateMessageStatus } from '@/lib/actions/messages';

function statusBadgeClasses(status: MessageStatus) {
  switch (status) {
    case MessageStatusEnum.NEW:
      return 'bg-blue-100 text-blue-700';
    case MessageStatusEnum.READ:
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

const statusLabel: Record<MessageStatus, string> = {
  [MessageStatusEnum.NEW]: 'New',
  [MessageStatusEnum.READ]: 'Read',
  [MessageStatusEnum.ARCHIVED]: 'Archived',
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

async function markMessage(formData: FormData) {
  'use server';

  const id = formData.get('id');
  const status = formData.get('status');

  if (typeof id !== 'string' || typeof status !== 'string') {
    return;
  }

  const validStatuses = Object.values(MessageStatusEnum) as MessageStatus[];
  if (!validStatuses.includes(status as MessageStatus)) {
    return;
  }

  await updateMessageStatus(id, status as MessageStatus);
}

async function removeMessage(formData: FormData) {
  'use server';

  const id = formData.get('id');
  if (typeof id !== 'string') {
    return;
  }

  await deleteMessage(id);
}

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const messages = await listMessages();

  if (messages.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">View and manage messages from your contact form</p>
        </div>

        <Card>
          <div className="p-6">
            <div className="py-12 text-center">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No Messages Yet</h3>
              <p className="mt-2 text-muted-foreground">Messages from your contact form will appear here.</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">View and manage messages from your contact form</p>
      </div>

      <Card>
        <div className="p-6">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Phone</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Subject</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Language</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Received</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message: Message) => (
                  <tr key={message.id} className="border-b">
                    <td className="p-4 align-middle font-medium">{message.name}</td>
                    <td className="p-4 align-middle text-muted-foreground">{message.email}</td>
                    <td className="p-4 align-middle text-muted-foreground">{message.phone ?? '—'}</td>
                    <td className="p-4 align-middle">{message.subject ?? '—'}</td>
                    <td className="p-4 align-middle uppercase text-muted-foreground">{message.language}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClasses(message.status)}`}>
                        {statusLabel[message.status]}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">{formatDate(message.receivedAt)}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <form action={markMessage}>
                          <input type="hidden" name="id" value={message.id} />
                          <input type="hidden" name="status" value={MessageStatusEnum.READ} />
                          <button type="submit" className="rounded-md p-2 hover:bg-muted" title="Mark as read">
                            <Mail className="h-4 w-4" />
                          </button>
                        </form>
                        <form action={markMessage}>
                          <input type="hidden" name="id" value={message.id} />
                          <input type="hidden" name="status" value={MessageStatusEnum.ARCHIVED} />
                          <button type="submit" className="rounded-md p-2 hover:bg-muted" title="Archive">
                            <Archive className="h-4 w-4" />
                          </button>
                        </form>
                        <form action={removeMessage}>
                          <input type="hidden" name="id" value={message.id} />
                          <button type="submit" className="rounded-md p-2 hover:bg-muted" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}

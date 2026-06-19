import { openFrontend } from '../helpers/browser.js';
import { apiRequest, createAuthenticatedUser } from '../helpers/apiClient.js';
import { assert, assertStatus, assertSuccess } from '../helpers/assert.js';

export default async function aiChatTests(ctx) {
  const driver = ctx.driver;
  const user = ctx.user || await createAuthenticatedUser(driver, 'aichat');
  ctx.user = user;

  await openFrontend(driver, '/ai-chat');

  const send = await apiRequest(driver, {
    method: 'POST',
    path: '/ai-chat/message',
    token: user.token,
    body: {
      message: 'Give me one short wellbeing tip for today.',
      category: 'GENERAL',
      saveToHistory: true
    }
  });
  assertStatus(send, 'POST /api/ai-chat/message');

  const conversationId = send.body?.data?.conversationId;
  const messageId = send.body?.data?.messageId;
  assert(conversationId, `Conversation ID not found: ${JSON.stringify(send.body)}`);

  const list = await apiRequest(driver, {
    method: 'GET',
    path: '/ai-chat/conversations?page=0&size=20',
    token: user.token
  });
  assertSuccess(list, 'GET /api/ai-chat/conversations');

  const history = await apiRequest(driver, {
    method: 'GET',
    path: `/ai-chat/conversations/${conversationId}`,
    token: user.token
  });
  assertSuccess(history, 'GET /api/ai-chat/conversations/{conversationId}');

  const category = await apiRequest(driver, {
    method: 'GET',
    path: '/ai-chat/conversations/category/GENERAL',
    token: user.token
  });
  assertSuccess(category, 'GET /api/ai-chat/conversations/category/{category}');

  if (messageId) {
    const save = await apiRequest(driver, {
      method: 'POST',
      path: `/ai-chat/messages/${messageId}/save`,
      token: user.token
    });
    assertStatus(save, 'POST /api/ai-chat/messages/{messageId}/save');

    const regenerate = await apiRequest(driver, {
      method: 'POST',
      path: `/ai-chat/conversations/${conversationId}/messages/${messageId}/regenerate`,
      token: user.token
    });
    assertStatus(regenerate, 'POST /api/ai-chat/conversations/{conversationId}/messages/{messageId}/regenerate');
  }

  const deleteConversation = await apiRequest(driver, {
    method: 'DELETE',
    path: `/ai-chat/conversations/${conversationId}`,
    token: user.token
  });
  assertStatus(deleteConversation, 'DELETE /api/ai-chat/conversations/{conversationId}');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { createDriver } = await import('../helpers/browser.js');
  const driver = await createDriver();
  try {
    await aiChatTests({ driver });
    console.log('AI chat tests passed');
  } finally {
    await driver.quit();
  }
}

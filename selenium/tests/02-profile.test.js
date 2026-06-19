import { openFrontend } from '../helpers/browser.js';
import { apiRequest, createAuthenticatedUser, uploadProfilePicture } from '../helpers/apiClient.js';
import { assertStatus, assertSuccess } from '../helpers/assert.js';

export default async function profileTests(ctx) {
  const driver = ctx.driver;
  const user = ctx.user || await createAuthenticatedUser(driver, 'profile');
  ctx.user = user;

  await openFrontend(driver, '/profile');

  const getProfile = await apiRequest(driver, {
    method: 'GET',
    path: '/profile',
    token: user.token
  });
  assertSuccess(getProfile, 'GET /api/profile');

  const updateProfile = await apiRequest(driver, {
    method: 'PUT',
    path: '/profile',
    token: user.token,
    body: {
      name: 'Updated Selenium User',
      email: user.email,
      phoneNumber: '+94712345678',
      bio: 'Updated by Selenium tests',
      dateOfBirth: '2000-01-01',
      gender: 'Male'
    }
  });
  assertSuccess(updateProfile, 'PUT /api/profile');

  const badPasswordChange = await apiRequest(driver, {
    method: 'POST',
    path: '/profile/change-password',
    token: user.token,
    body: {
      currentPassword: 'WrongPassword@123',
      newPassword: 'ChangedPassword@123',
      confirmPassword: 'ChangedPassword@123'
    }
  });
  assertStatus(badPasswordChange, 'POST /api/profile/change-password');

  const upload = await uploadProfilePicture(driver, user.token);
  assertStatus(upload, 'POST /api/profile/upload-picture');

  const deletePicture = await apiRequest(driver, {
    method: 'DELETE',
    path: '/profile/picture',
    token: user.token
  });
  assertStatus(deletePicture, 'DELETE /api/profile/picture');

  const assessmentStatus = await apiRequest(driver, {
    method: 'GET',
    path: '/profile/assessment-status',
    token: user.token
  });
  assertSuccess(assessmentStatus, 'GET /api/profile/assessment-status');

  const deactivateUser = await createAuthenticatedUser(driver, 'deactivate');
  const deactivate = await apiRequest(driver, {
    method: 'POST',
    path: '/profile/deactivate',
    token: deactivateUser.token
  });
  assertStatus(deactivate, 'POST /api/profile/deactivate');

  const deleteUser = await createAuthenticatedUser(driver, 'delete');
  const deleteAccount = await apiRequest(driver, {
    method: 'DELETE',
    path: '/profile/account',
    token: deleteUser.token
  });
  assertStatus(deleteAccount, 'DELETE /api/profile/account');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { createDriver } = await import('../helpers/browser.js');
  const driver = await createDriver();
  try {
    await profileTests({ driver });
    console.log('Profile tests passed');
  } finally {
    await driver.quit();
  }
}

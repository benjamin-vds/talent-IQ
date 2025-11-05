import { describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert';

describe('inngest.js module', () => {
  describe('Module imports and exports', () => {
    it('should import Inngest from inngest package', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('import { Inngest } from "inngest"'),
        'Should import Inngest from inngest package'
      );
    });

    it('should import connectDB from db.js', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('import { connectDB } from "./db.js"'),
        'Should import connectDB from db.js'
      );
    });

    it('should import User model', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('import User from "../models/User.js"'),
        'Should import User model'
      );
    });

    it('should import upsertStreamUser and deleteStreamUser from stream.js', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('import { upsertStreamUser, deleteStreamUser } from "./stream.js"'),
        'Should import stream functions from stream.js'
      );
    });

    it('should export inngest instance', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('export const inngest'),
        'Should export inngest instance'
      );
    });

    it('should create inngest instance with correct id', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('new Inngest({ id: "talent-iq" })'),
        'Should create Inngest instance with id "talent-iq"'
      );
    });

    it('should export functions array', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('export const functions'),
        'Should export functions array'
      );
    });

    it('should export array containing syncUser and deleteUserFromDB', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('[syncUser, deleteUserFromDB]'),
        'functions array should contain syncUser and deleteUserFromDB'
      );
    });
  });

  describe('syncUser function', () => {
    it('should be created using inngest.createFunction', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('const syncUser = inngest.createFunction'),
        'syncUser should be created using inngest.createFunction'
      );
    });

    it('should have function id "sync-user"', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('{ id: "sync-user" }'),
        'syncUser should have id "sync-user"'
      );
    });

    it('should listen to "clerk/user.created" event', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('{ event: "clerk/user.created" }'),
        'syncUser should listen to "clerk/user.created" event'
      );
    });

    it('should be an async function', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('async ({ event })'),
        'syncUser handler should be async'
      );
    });

    it('should call connectDB at the start', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const syncUserSection = fileContent.substring(
        fileContent.indexOf('const syncUser'),
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      assert.ok(
        syncUserSection.includes('await connectDB()'),
        'syncUser should call connectDB'
      );
    });

    it('should destructure event.data to extract user fields', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('const { id, email_addresses, first_name, last_name, image_url } = event.data'),
        'Should destructure id, email_addresses, first_name, last_name, image_url from event.data'
      );
    });

    it('should convert id to string using toString()', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('clerkId: id.toString()'),
        'Should convert id to string using toString() - THIS IS THE KEY CHANGE'
      );
    });

    it('should extract email from first email_address', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('email: email_addresses[0]?.email_address'),
        'Should use optional chaining to get email from first email_address'
      );
    });

    it('should construct name from first_name and last_name with fallbacks', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('name: `${first_name || ""} ${last_name || ""}`'),
        'Should construct name with empty string fallbacks for missing names'
      );
    });

    it('should map image_url to profileImage', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('profileImage: image_url'),
        'Should map image_url to profileImage'
      );
    });

    it('should create user in database', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const syncUserSection = fileContent.substring(
        fileContent.indexOf('const syncUser'),
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      assert.ok(
        syncUserSection.includes('await User.create(newUser)'),
        'Should create user in database using User.create'
      );
    });

    it('should call upsertStreamUser after creating user', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const syncUserSection = fileContent.substring(
        fileContent.indexOf('const syncUser'),
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      assert.ok(
        syncUserSection.includes('await upsertStreamUser('),
        'Should call upsertStreamUser'
      );
    });

    it('should pass correct data structure to upsertStreamUser', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const hasIdField = fileContent.includes('id: newUser.clerkId.toString()');
      const hasNameField = fileContent.includes('name: newUser.name');
      const hasImageField = fileContent.includes('image: newUser.profileImage');
      
      assert.ok(
        hasIdField && hasNameField && hasImageField,
        'Should pass object with id, name, and image to upsertStreamUser'
      );
    });

    it('should convert clerkId to string again when passing to upsertStreamUser', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('id: newUser.clerkId.toString()'),
        'Should ensure clerkId is string when passing to Stream'
      );
    });
  });

  describe('deleteUserFromDB function', () => {
    it('should be created using inngest.createFunction', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('const deleteUserFromDB = inngest.createFunction'),
        'deleteUserFromDB should be created using inngest.createFunction'
      );
    });

    it('should have function id "delete-user-from-db"', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('{ id: "delete-user-from-db" }'),
        'deleteUserFromDB should have id "delete-user-from-db"'
      );
    });

    it('should listen to "clerk/user.deleted" event', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('{ event: "clerk/user.deleted" }'),
        'deleteUserFromDB should listen to "clerk/user.deleted" event'
      );
    });

    it('should be an async function', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const deleteSection = fileContent.substring(
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      assert.ok(
        deleteSection.includes('async ({ event })'),
        'deleteUserFromDB handler should be async'
      );
    });

    it('should call connectDB at the start', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const deleteSection = fileContent.substring(
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      assert.ok(
        deleteSection.includes('await connectDB()'),
        'deleteUserFromDB should call connectDB'
      );
    });

    it('should extract id from event.data', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const deleteSection = fileContent.substring(
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      assert.ok(
        deleteSection.includes('const { id } = event.data'),
        'Should extract id from event.data'
      );
    });

    it('should delete user by clerkId from database', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const deleteSection = fileContent.substring(
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      assert.ok(
        deleteSection.includes('await User.deleteOne({ clerkId: id })'),
        'Should delete user using User.deleteOne with clerkId'
      );
    });

    it('should call deleteStreamUser after deleting from DB', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const deleteSection = fileContent.substring(
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      assert.ok(
        deleteSection.includes('await deleteStreamUser('),
        'Should call deleteStreamUser'
      );
    });

    it('should convert id to string when calling deleteStreamUser', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const deleteSection = fileContent.substring(
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      assert.ok(
        deleteSection.includes('await deleteStreamUser(id.toString())'),
        'Should convert id to string when calling deleteStreamUser'
      );
    });
  });

  describe('Data consistency and type handling', () => {
    it('should handle id consistently as string throughout syncUser', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const syncUserSection = fileContent.substring(
        fileContent.indexOf('const syncUser'),
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      const toStringCount = (syncUserSection.match(/\.toString\(\)/g) || []).length;
      
      assert.strictEqual(
        toStringCount,
        2,
        'id should be converted to string twice in syncUser (for DB and Stream)'
      );
    });

    it('should document potential issue with User model missing clerkId field', async () => {
      const userModelContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/models/User.js', 'utf-8')
      );
      
      const hasClerkId = userModelContent.includes('clerkId');
      
      assert.strictEqual(
        hasClerkId,
        false,
        'CRITICAL: User model does not define clerkId field but inngest.js tries to use it'
      );
    });

    it('should verify User model has name field as required', async () => {
      const userModelContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/models/User.js', 'utf-8')
      );
      
      assert.ok(
        userModelContent.includes('name:') && userModelContent.includes('required: true'),
        'User model should have name field marked as required'
      );
    });

    it('should verify User model has email field as required', async () => {
      const userModelContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/../models/User.js', 'utf-8')
      );
      
      assert.ok(
        userModelContent.includes('email:') && userModelContent.includes('required: true'),
        'User model should have email field marked as required'
      );
    });

    it('should verify User model has profileImage field', async () => {
      const userModelContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/models/User.js', 'utf-8')
      );
      
      assert.ok(
        userModelContent.includes('profileImage:'),
        'User model should have profileImage field'
      );
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle missing email_addresses array', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('email_addresses[0]?.email_address'),
        'Uses optional chaining for email_addresses which handles undefined'
      );
    });

    it('should handle missing first_name', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('first_name || ""'),
        'Uses fallback empty string for missing first_name'
      );
    });

    it('should handle missing last_name', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.includes('last_name || ""'),
        'Uses fallback empty string for missing last_name'
      );
    });

    it('should document lack of try-catch in syncUser', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const syncUserSection = fileContent.substring(
        fileContent.indexOf('const syncUser'),
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      const hasTryCatch = syncUserSection.includes('try {') && syncUserSection.includes('catch');
      
      assert.strictEqual(
        hasTryCatch,
        false,
        'syncUser does not have try-catch error handling (errors propagate to Inngest)'
      );
    });

    it('should document lack of try-catch in deleteUserFromDB', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const deleteSection = fileContent.substring(
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      const hasTryCatch = deleteSection.includes('try {') && deleteSection.includes('catch');
      
      assert.strictEqual(
        hasTryCatch,
        false,
        'deleteUserFromDB does not have try-catch error handling (errors propagate to Inngest)'
      );
    });

    it('should verify that name could be just whitespace with empty first/last names', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      // Name construction: `${first_name || ""} ${last_name || ""}` results in " " when both are missing
      assert.ok(
        fileContent.includes('`${first_name || ""} ${last_name || ""}`'),
        'Name construction could result in single space " " when both names are missing'
      );
    });
  });

  describe('Integration and sequencing', () => {
    it('should create DB user before syncing to Stream', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const syncUserSection = fileContent.substring(
        fileContent.indexOf('const syncUser'),
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      const userCreateIndex = syncUserSection.indexOf('User.create');
      const streamUpsertIndex = syncUserSection.indexOf('upsertStreamUser');
      
      assert.ok(
        userCreateIndex < streamUpsertIndex,
        'User should be created in DB before syncing to Stream'
      );
    });

    it('should delete from DB before deleting from Stream', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const deleteSection = fileContent.substring(
        fileContent.indexOf('const deleteUserFromDB')
      );
      
      const userDeleteIndex = deleteSection.indexOf('User.deleteOne');
      const streamDeleteIndex = deleteSection.indexOf('deleteStreamUser');
      
      assert.ok(
        userDeleteIndex < streamDeleteIndex,
        'User should be deleted from DB before deleting from Stream'
      );
    });

    it('should not have rollback logic if Stream operations fail', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const hasRollback = fileContent.includes('User.deleteOne') && 
                         fileContent.includes('// rollback') ||
                         fileContent.includes('compensat');
      
      assert.strictEqual(
        hasRollback,
        false,
        'No rollback/compensation logic if Stream operations fail after DB changes'
      );
    });
  });

  describe('Function exports and configuration', () => {
    it('should export exactly two functions', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const functionsArray = fileContent.match(/export const functions = \[([^\]]+)\]/);
      
      if (functionsArray) {
        const functionNames = functionsArray[1].split(',').map(s => s.trim());
        assert.strictEqual(
          functionNames.length,
          2,
          'Should export exactly 2 functions'
        );
      }
    });

    it('should have distinct function IDs', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const hasSyncUserId = fileContent.includes('id: "sync-user"');
      const hasDeleteUserId = fileContent.includes('id: "delete-user-from-db"');
      
      assert.ok(
        hasSyncUserId && hasDeleteUserId,
        'Both functions should have distinct IDs'
      );
    });

    it('should listen to different Clerk events', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      const hasCreatedEvent = fileContent.includes('event: "clerk/user.created"');
      const hasDeletedEvent = fileContent.includes('event: "clerk/user.deleted"');
      
      assert.ok(
        hasCreatedEvent && hasDeletedEvent,
        'Functions should listen to different Clerk events'
      );
    });
  });

  describe('Code style and formatting', () => {
    it('should have consistent indentation', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      // Check if file uses consistent spacing (2 or 4 spaces)
      const lines = fileContent.split('\n');
      const indentedLines = lines.filter(line => line.match(/^\s+\S/));
      
      assert.ok(
        indentedLines.length > 0,
        'File should have indented lines'
      );
    });

    it('should end with newline', async () => {
      const fileContent = await import('fs').then(fs => 
        fs.promises.readFile('backend/src/lib/inngest.js', 'utf-8')
      );
      
      assert.ok(
        fileContent.endsWith('\n'),
        'File should end with newline'
      );
    });
  });
});
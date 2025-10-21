# Vapi API Setup Guide

This document explains how to set up the Vapi API integration for the memory collection call feature.

## Environment Variables

You need to add the following environment variables to your `.env.local` file:

```env
# Vapi API Configuration
VAPI_API_TOKEN=your_api_token_here
VAPI_ASSISTANT_ID=your_assistant_id_here
VAPI_PHONE_NUMBER_ID=your_phone_number_id_here
```

### Getting Your Vapi Credentials

1. **API Token**: Get this from your [Vapi Dashboard](https://dashboard.vapi.ai)

   - Navigate to Settings → API Keys
   - Copy your API token

2. **Assistant ID**: The ID of the assistant you want to use for calls

   - Navigate to Assistants in your Vapi dashboard
   - Select or create an assistant
   - Copy the Assistant ID

3. **Phone Number ID**: The ID of the phone number to use for outbound calls
   - Navigate to Phone Numbers in your Vapi dashboard
   - Select a phone number
   - Copy the Phone Number ID

## Current Values (from your curl command)

Based on the curl command you provided, here are the values:

```env
VAPI_API_TOKEN=92465581-01f3-41c3-b0f1-e2d048134101
VAPI_ASSISTANT_ID=387c1183-64d6-4118-a784-03b5a8298567
VAPI_PHONE_NUMBER_ID=5d6c2db8-cdbf-49cf-bcd8-42d693584163
```

## How It Works

When a user submits the form on the `/create` page:

1. Form data (name, phone number, memory prompt) is validated using Zod
2. A server action makes a POST request to `https://api.vapi.ai/call/phone`
3. The API initiates a phone call to the provided number
4. The assistant uses the provided variables:
   - `name`: The recipient's name
   - `customQuestions`: The memory prompt to discuss

## Testing

To test the integration:

1. Ensure your environment variables are set in `.env.local`
2. Navigate to `/create` in your app
3. Fill in the form with valid test data
4. Click "Make Call"
5. The system should initiate a call to the provided number

## Error Handling

The implementation includes comprehensive error handling for:

- Invalid form data (validation errors)
- Missing environment variables
- API request failures
- Network errors

All errors are displayed to the user in a friendly format on the form.

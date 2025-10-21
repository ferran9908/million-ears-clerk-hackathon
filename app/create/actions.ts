"use server";

import { z } from "zod";

/**
 * Schema for validating memory collection call data
 */
const callSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  customQuestions: z.string().min(1, "Memory prompt is required"),
});

type CallFormData = z.infer<typeof callSchema>;

interface VapiCallResponse {
  success: boolean;
  callId?: string;
  error?: string;
}

/**
 * Server action to initiate a phone call via Vapi API
 * @param formData - Form data containing name, phone number, and custom questions
 * @returns Response indicating success or failure
 */
export async function makeMemoryCall(
  formData: FormData
): Promise<VapiCallResponse> {
  try {
    // Extract and validate form data
    const data: CallFormData = {
      name: formData.get("name") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      customQuestions: formData.get("customQuestions") as string,
    };

    // Validate input
    const validationResult = callSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0].message,
      };
    }

    const { name, phoneNumber, customQuestions } = validationResult.data;

    // Prepare API request
    const apiUrl = "https://api.vapi.ai/call/phone";
    const apiToken = process.env.VAPI_API_TOKEN;

    if (!apiToken) {
      throw new Error("VAPI_API_TOKEN environment variable is not set");
    }

    // Make API call to Vapi
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId: process.env.VAPI_ASSISTANT_ID,
        phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
        customer: {
          number: phoneNumber,
        },
        assistantOverrides: {
          variableValues: {
            name,
            customQuestions,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
    }

    const responseData = await response.json();

    return {
      success: true,
      callId: responseData.id || responseData.callId,
    };
  } catch (error) {
    console.error("Error making memory call:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to initiate call",
    };
  }
}

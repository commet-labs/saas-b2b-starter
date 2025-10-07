export const organizationLocales = {
  organization: {
    title: "Organization Settings",
    description: "Manage your organization's information and settings.",
    create: {
      title: "Create your first organization",
      description:
        "To get started, you need to create an organization where you can manage your projects and billing.",
      form: {
        name: {
          label: "Organization name",
          placeholder: "My company",
        },

        submit: "Create organization",
        submitting: "Creating...",
      },
      validation: {
        name: {
          required: "Organization name is required",
          maxLength: "Organization name must be less than 50 characters",
        },
        slug: {
          required: "Organization slug is required",
          maxLength: "Organization slug must be less than 48 characters",
          format: "Only lowercase letters, numbers and hyphens are allowed",
        },
      },
      messages: {
        success: "Organization created successfully",
        error: "Failed to create organization",
        slugTaken: "This slug is already taken. Please choose a different one.",
        redirecting:
          "Once created, you will be automatically redirected to your organization dashboard.",
      },
    },
    name: {
      title: "Organization Name",
      description:
        "This is your organization's visible name. For example, the name of your company or department.",
      form: {
        label: "Organization Name",
        placeholder: "Enter your organization name",
        validation: {
          required: "Organization name is required",
          maxLength: "Organization name must be less than 32 characters",
        },
      },
      submit: "Save Name",
      submitting: "Saving...",
      footer: "Please use 32 characters at maximum.",
    },
    slug: {
      title: "Organization URL",
      description:
        "This is your organization's URL namespace. Within it, your team can inspect their projects, check out any recent activity, or configure settings to their liking.",
      form: {
        label: "Organization URL",
        placeholder: "your-organization",
        validation: {
          required: "Organization URL is required",
          maxLength: "Organization URL must be less than 48 characters",
          format:
            "URL can only contain lowercase letters, numbers, and hyphens",
        },
      },
      submit: "Save URL",
      submitting: "Saving...",
      footer: "Please use 48 characters at maximum.",
      prefix: "commet.co/",
    },
    logo: {
      title: "Organization Avatar",
      description:
        "This is your organization's avatar. Click on the avatar to upload a custom one from your files.",
      form: {
        validation: {
          invalidUrl: "Please provide a valid URL for the logo",
          required: "Image is required",
          maxSize: "Image must be smaller than 5MB",
          invalidType: "Only JPEG, PNG, and WebP images are supported",
        },
      },
      submit: "Save Avatar",
      submitting: "Saving...",
      uploading: "Uploading image...",
      footer: "An avatar is optional but strongly recommended.",
    },
    delete: {
      title: "Delete Organization",
      description:
        "Permanently delete your organization and all of its contents from the platform. This action is not reversible, so please continue with caution.",
      footer: "This action cannot be undone.",
      button: "Delete Organization",
      dialog: {
        title: "Delete Organization",
        description:
          "This will permanently delete the organization and all associated data. This action cannot be undone.",
        form: {
          confirmation: {
            label: 'Type "delete my organization" to confirm:',
            placeholder: "delete my organization",
            text: "delete my organization",
          },
          organizationName: {
            label: "Type the organization name ({name}) to confirm:",
          },
          cancel: "Cancel",
          delete: "Delete Organization",
          deleting: "Deleting...",
          validation: {
            confirmation: 'You must type "delete my organization" to confirm',
            organizationName: "Organization name is required",
          },
        },
      },
    },
    messages: {
      nameUpdateSuccess: "Organization name updated successfully",
      slugUpdateSuccess: "Organization URL updated successfully",
      logoUpdateSuccess: "Organization avatar updated successfully",
      deleteSuccess: "Organization deleted successfully",
      error: "Failed to update organization. Please try again.",
      unauthorized: "You don't have permission to modify organization settings",
      slugUnauthorized: "Only organization owners can change the URL",
      deleteUnauthorized:
        "Only organization owners can delete the organization",
      slugTaken: "This URL is already taken by another organization",
      nameDoesNotMatch: "Organization name does not match",
    },
    billing: {
      title: "Billing Configuration",
      description:
        "Configure how your organization handles billing for usage events and seat changes.",
      billingTimezoneStrategy: {
        title: "Billing Timezone Strategy",
        description:
          "Which timezone to use when calculating billing period boundaries (e.g., Jan 1-31).",
        tooltip:
          "This determines when a billing day starts/ends. Customer timezone is most accurate but operationally complex. UTC is simplest but may misalign with customer expectations.",
        options: {
          customer_timezone: {
            label: "Customer Timezone (Default)",
            description:
              "Bill at midnight in each customer's timezone - most accurate but operationally complex",
          },
          organization_timezone: {
            label: "Organization Timezone",
            description:
              "Bill at midnight in your organization's timezone - simpler operations, uniform billing time",
          },
        },
      },
      lateEventsPolicy: {
        title: "Late Events Policy",
        description:
          "How to handle usage events that arrive after the billing period has closed.",
        tooltip:
          "Events can arrive late due to network delays, retries, or batch processing. This policy determines how to bill them.",
        options: {
          next_period: {
            label: "Bill in Next Period (Default)",
            description:
              "Late events are included in the next billing period (default)",
          },
          current_period: {
            label: "Bill in Current Period",
            description:
              "Late events trigger supplementary invoices for the closed period",
          },
          ignore: {
            label: "Ignore Late Events",
            description: "Late events are discarded and not billed",
          },
        },
      },
      seatProrationStrategy: {
        title: "Seat Proration Precision",
        description:
          "How precisely to calculate charges when seat counts change mid-cycle.",
        tooltip:
          "Determines the granularity of time-weighted averaging for seat changes. Higher precision means fairer billing but more complex calculations.",
        options: {
          daily: {
            label: "Daily Proration (Default)",
            description: "Calculate seat charges by day (recommended)",
          },
          hourly: {
            label: "Hourly Proration",
            description: "Calculate seat charges by hour (maximum precision)",
          },
          none: {
            label: "No Proration",
            description:
              "Charge based on final seat count for the entire period",
          },
        },
      },
      seatProrationDirection: {
        title: "Seat Proration Direction",
        description:
          "Whether to prorate charges when seats increase, decrease, or both.",
        tooltip:
          "Controls whether customers receive credits for removed seats or only pay for added seats proportionally.",
        options: {
          both: {
            label: "Prorate Both Ways (Default)",
            description: "Prorate charges for both increases and decreases",
          },
          up_only: {
            label: "Prorate Increases Only",
            description:
              "Prorate when adding seats, no refunds when removing (like GitHub)",
          },
          none: {
            label: "No Proration",
            description: "Charge full period regardless of when changes occur",
          },
        },
      },
      seatRoundingPolicy: {
        title: "Seat Rounding Policy",
        description:
          "How to round prorated seat charges when the result is a decimal.",
        tooltip:
          "Determines rounding behavior for fractional seat charges. Affects revenue and customer perception.",
        options: {
          round_nearest: {
            label: "Round to Nearest (Default)",
            description: "Round to the nearest cent (most fair)",
          },
          round_up: {
            label: "Round Up",
            description: "Always round up (favors your revenue)",
          },
          round_down: {
            label: "Round Down",
            description: "Always round down (favors customer)",
          },
        },
      },
      messages: {
        timezoneUpdateSuccess: "Billing timezone strategy updated successfully",
        lateEventsUpdateSuccess: "Late events policy updated successfully",
        roundingUpdateSuccess: "Seat rounding policy updated successfully",
        prorationStrategyUpdateSuccess:
          "Seat proration strategy updated successfully",
        prorationDirectionUpdateSuccess:
          "Seat proration direction updated successfully",
        error: "Failed to update billing settings. Please try again.",
        unauthorized: "You don't have permission to modify billing settings",
      },
    },
  },
} as const;

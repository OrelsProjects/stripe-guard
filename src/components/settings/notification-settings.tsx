"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NotificationsChannel } from "@/models/user";
import { useEffect } from "react";

export interface NotificationSettingsProps {
  notificationEmail: NotificationsChannel;
  onEmailChange: (value: NotificationsChannel) => void;
}

export function NotificationSettings({
  notificationEmail,
  onEmailChange,
}: NotificationSettingsProps) {
  const formik = useFormik({
    initialValues: {
      enabled: notificationEmail.enabled,
      value: notificationEmail.value || "",
    },
    validationSchema: Yup.object({
      value: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: values => {
      onEmailChange({
        ...notificationEmail,
        ...values,
      });
    },
  });

  useEffect(() => {
    formik.setValues({
      enabled: notificationEmail.enabled,
      value: notificationEmail.value || "",
    });
  }, [notificationEmail]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about webhook failures
            </p>
          </div>
          <Switch
            name="enabled"
            checked={formik.values.enabled}
            onCheckedChange={checked => {
              formik.setFieldValue("enabled", checked);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notification-email">Notification Email</Label>
          <Input
            id="notification-email"
            type="email"
            placeholder="your@email.com"
            disabled={!formik.values.enabled}
            value={formik.values.value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="value"
          />
          {formik.touched.value && formik.errors.value ? (
            <p className="text-sm text-red-500">{formik.errors.value}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!formik.dirty || !formik.isValid}
        >
          Save Settings
        </button>
      </form>
    </Card>
  );
}

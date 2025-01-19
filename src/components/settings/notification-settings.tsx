"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NotificationsChannel } from "@/models/user";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export interface NotificationSettingsProps {
  notificationEmail: NotificationsChannel;
  onChange: (value: NotificationsChannel) => void;
  loading?: boolean;
}

export function NotificationSettings({
  notificationEmail,
  onChange,
  loading = false,
}: NotificationSettingsProps) {
  const formik = useFormik({
    initialValues: {
      enabled: notificationEmail.enabled,
      value: notificationEmail.value || "example@example.com",
    },
    validationSchema: Yup.object({
      value: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: values => {
      onChange({
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
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Notification Preferences
      </h2>
      {loading ? (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-10" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full md:w-64" />
          </div>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
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
                onChange({
                  ...notificationEmail,
                  enabled: checked,
                });
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
              onChange={e => {
                formik.handleChange(e);
                onChange({
                  ...notificationEmail,
                  value: e.target.value,
                });
              }}
              onBlur={formik.handleBlur}
              name="value"
              className="w-full md:max-w-md"
            />
            {formik.touched.value && formik.errors.value ? (
              <p className="text-sm text-red-500">{formik.errors.value}</p>
            ) : null}
          </div>
        </form>
      )}
    </Card>
  );
}

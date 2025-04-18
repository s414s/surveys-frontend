"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createNewDriver } from "@/utils/endpoints";
import { CreateNewUserRequest } from "@/appTypes";
import { useRouter } from "next/navigation";

export default function UserCreationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    dateOfBirth: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const request: CreateNewUserRequest = {
        name: formData.name,
        surname: formData.surname,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        email: formData.email
      };

      const result = await createNewDriver(request);
      alert(`new user created successfully. Random password is: ${result.password}`);
      router.push("/cargotrack/drivers");
    } catch (error) {
      console.error(error);
    }

    setFormData({ name: "", surname: "", dateOfBirth: "", email: "" });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Driver</CardTitle>
        <CardDescription>Enter the user details to create a new driver</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surname">Surname</Label>
            <Input
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Enter surname"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              className="[&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert(1)"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              type="date"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="user@example.com"
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full">
            Create Driver
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

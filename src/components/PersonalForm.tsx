import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PersonalFormProps {
  personalData: {
    fullName: string;
    date: Date | undefined;
  };
  onPersonalDataChange: (data: { fullName: string; date: Date | undefined }) => void;
  onSubmit: (e: React.FormEvent) => void;
  datePickerOpen: boolean;
  onDatePickerOpenChange: (open: boolean) => void;
}

const PersonalForm: React.FC<PersonalFormProps> = ({
  personalData,
  onPersonalDataChange,
  onSubmit,
  datePickerOpen,
  onDatePickerOpenChange
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-blue-200">
        <CardHeader className="text-center bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-2">
            <User className="h-8 w-8 mr-2" />
            <CardTitle className="text-2xl">Medical Questionnaire</CardTitle>
          </div>
          <p className="text-blue-100">Please provide your personal details to begin</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700 font-medium">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={personalData.fullName}
                onChange={(e) => onPersonalDataChange({...personalData, fullName: e.target.value})}
                className="border-blue-200 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Date *</Label>
              <Popover open={datePickerOpen} onOpenChange={onDatePickerOpenChange}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-blue-200 focus:border-blue-500",
                      !personalData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {personalData.date ? format(personalData.date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={personalData.date}
                    onSelect={(date) => {
                      onPersonalDataChange({...personalData, date});
                      onDatePickerOpenChange(false);
                    }}
                    className="pointer-events-auto"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
            >
              Start Questionnaire
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalForm;
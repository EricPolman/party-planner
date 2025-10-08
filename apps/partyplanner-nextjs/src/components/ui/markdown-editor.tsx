"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={(v: string) => setActiveTab(v as "write" | "preview")}
      >
        <TabsContent value="write" className="m-0">
          <textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[400px] resize-y bg-background p-4 text-sm font-mono focus:outline-none"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

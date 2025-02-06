
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from 'pdfjs-dist';
import { Progress } from "@/components/ui/progress";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export function DocumentUpload() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    
    if (!['application/pdf', 'text/plain'].includes(file.type)) {
      throw new Error('Only PDF and text files are supported');
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    console.log('Starting PDF text extraction');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      setProgress((i / pdf.numPages) * 50); // First 50% is PDF processing
      console.log(`Processing PDF page ${i}/${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    console.log('PDF text extraction completed');
    return fullText;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setProgress(0);
      console.log('Starting file upload process:', file.name);
      
      // Validate file
      validateFile(file);
      
      // Extract text based on file type
      let text;
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.type === 'text/plain') {
        text = await file.text();
        setProgress(50);
      }

      console.log('Text extracted, length:', text?.length);
      
      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from the file');
      }

      // Store the document with vector embedding
      console.log('Sending to vector-operations function');
      setProgress(75);
      
      const { data, error } = await supabase.functions.invoke('vector-operations', {
        body: {
          action: 'store',
          content: text,
          metadata: { 
            filename: file.name,
            fileType: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            status: 'processing'
          }
        }
      });

      if (error) throw error;

      setProgress(100);
      console.log('Document processed successfully:', data);

      toast({
        title: "Success",
        description: "Document uploaded and processed successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload and process document",
      });
    } finally {
      setLoading(false);
      setProgress(0);
      // Reset the file input
      event.target.value = '';
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upload Documents</h2>
        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            disabled={loading}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
          {loading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-slate-500">
                {progress < 50 && "Extracting text..."}
                {progress >= 50 && progress < 75 && "Processing text..."}
                {progress >= 75 && "Generating embedding..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

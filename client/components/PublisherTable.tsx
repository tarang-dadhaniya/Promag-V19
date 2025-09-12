import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

const publisherData = [
  {
    id: 1,
    name: "Floyd Miles",
    phone: "+447700960748",
    title: "The More Important the Work, the More Important the Rest",
  },
  {
    id: 2,
    name: "Leslie Alexander",
    phone: "+447700960939",
    title:
      "Understanding color theory: the color wheel and finding complementary colors",
  },
  {
    id: 3,
    name: "Marvin McKinney",
    phone: "+447700960035",
    title: "Any mechanical keyboard enthusiasts in design?",
  },
  {
    id: 4,
    name: "Ralph Edwards",
    phone: "+447700960612",
    title:
      "Yo Reddit! What's a small thing that anyone can do at nearly anytime to improve their mood and make",
  },
  {
    id: 5,
    name: "Ronald Richards",
    phone: "+447700960054",
    title: "Any mechanical keyboard enthusiasts in design?",
  },
  {
    id: 6,
    name: "Esther Howard",
    phone: "+447700960776",
    title: "How to design a product that can grow itself 10x in year:",
  },
];

export function PublisherTable() {
  return (
    <div className="w-full rounded-[5px] border border-[#DEE6ED] overflow-hidden">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-promag-primary border-b border-white hover:bg-promag-primary">
            <TableHead className="h-auto py-[18px] px-4 pl-9 text-white font-inter text-sm font-bold uppercase text-left">
              Publisher Name
            </TableHead>
            <TableHead className="h-auto py-[18px] px-4 text-white font-inter text-sm font-bold uppercase">
              <div className="flex items-center gap-1">
                Phone
                <ArrowUpDown className="w-4 h-4 text-[#9E9E9E]" />
              </div>
            </TableHead>
            <TableHead className="h-auto py-[18px] px-4 text-white font-inter text-sm font-bold uppercase">
              <div className="flex items-center gap-2">
                Title
                <ArrowUpDown className="w-4 h-4 text-[#9E9E9E]" />
              </div>
            </TableHead>
            <TableHead className="h-auto py-[18px] px-4 text-white font-inter text-sm font-bold uppercase text-center">
              Options
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publisherData.map((publisher, index) => (
            <TableRow
              key={publisher.id}
              className={`border-0 hover:bg-muted/50 ${
                index % 2 === 0 ? "bg-[#F5F5F5]" : "bg-white"
              }`}
            >
              <TableCell className="py-4 px-4 pl-9 text-black font-inter text-sm font-normal">
                {publisher.name}
              </TableCell>
              <TableCell className="py-4 px-4 text-black font-inter text-sm font-normal">
                {publisher.phone}
              </TableCell>
              <TableCell className="py-4 px-4 text-black font-inter text-sm font-normal">
                {publisher.title}
              </TableCell>
              <TableCell className="py-4 px-4">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto hover:bg-transparent"
                  >
                    <Edit
                      className="w-5 h-5 text-promag-primary"
                      strokeWidth={2}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto hover:bg-transparent"
                  >
                    <Trash2
                      className="w-5 h-5 text-[#D9534F]"
                      strokeWidth={2}
                    />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

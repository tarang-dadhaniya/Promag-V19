import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";

// Sample data to match the Figma design
const publisherData = [
  {
    id: 1,
    name: "Safari",
    phone: "+1 (987) 134-4535",
    email: "safari.demo@gmail.com",
    language: "English",
  },
  {
    id: 2,
    name: "Safari",
    phone: "+1 (987) 134-4535",
    email: "safari.demo@gmail.com",
    language: "English",
  },
  {
    id: 3,
    name: "Safari",
    phone: "+1 (987) 134-4535",
    email: "safari.demo@gmail.com",
    language: "English",
  },
  {
    id: 4,
    name: "Safari",
    phone: "+1 (987) 134-4535",
    email: "safari.demo@gmail.com",
    language: "English",
  },
  {
    id: 5,
    name: "Safari",
    phone: "+1 (987) 134-4535",
    email: "safari.demo@gmail.com",
    language: "English",
  },
  {
    id: 6,
    name: "Safari",
    phone: "+1 (987) 134-4535",
    email: "safari.demo@gmail.com",
    language: "English",
  },
  {
    id: 7,
    name: "Safari",
    phone: "+1 (987) 134-4535",
    email: "safari.demo@gmail.com",
    language: "English",
  },
  {
    id: 8,
    name: "Safari",
    phone: "+1 (987) 134-4535",
    email: "safari.demo@gmail.com",
    language: "English",
  },
  {
    id: 9,
    name: "Safari",
    phone: "+1 (987) 134-4535",
    email: "safari.demo@gmail.com",
    language: "English",
  },
  {
    id: 10,
    name: "Safari",
    phone: "+1 (987) 134-4535",
    email: "safari.demo@gmail.com",
    language: "English",
  },
];

export default function PushNotifications() {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(publisherData.length / parseInt(pageSize));
  const startIndex = (currentPage - 1) * parseInt(pageSize);
  const endIndex = startIndex + parseInt(pageSize);
  const currentData = publisherData.slice(startIndex, endIndex);

  const handleEdit = (id: number) => {
    console.log("Edit publisher:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete publisher:", id);
  };

  const PaginationButton = ({ 
    children, 
    onClick, 
    isActive = false, 
    disabled = false,
    className = ""
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
    disabled?: boolean;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center h-[33px] px-3 border border-[#DEE6ED] text-sm font-inter
        ${isActive 
          ? 'bg-promag-primary text-white border-promag-primary' 
          : 'bg-white text-promag-body hover:bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="flex w-screen h-screen bg-promag-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <Header title={t("menu.pushNotifications")} />

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-3 md:p-5 gap-5">
          {/* Table Container */}
          <div className="bg-white rounded-[5px] border border-[rgba(222,230,237,0.87)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
            {/* Table */}
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-promag-primary border-b border-white hover:bg-promag-primary">
                  <TableHead className="h-[53px] px-4 pl-9 text-white font-bold text-sm uppercase font-inter">
                    Publisher Name
                  </TableHead>
                  <TableHead className="h-[53px] px-4 text-white font-bold text-sm uppercase font-inter">
                    <div className="flex items-center gap-1">
                      Phone
                      <div className="flex flex-col">
                        <ChevronUp className="h-2 w-2 fill-[#9E9E9E] text-[#9E9E9E]" />
                        <ChevronDown className="h-2 w-2 fill-[#9E9E9E] text-[#9E9E9E]" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="h-[53px] px-4 text-white font-bold text-sm uppercase font-inter">
                    <div className="flex items-center gap-2">
                      Email
                      <div className="flex flex-col">
                        <ChevronUp className="h-2 w-2 fill-[#9E9E9E] text-[#9E9E9E]" />
                        <ChevronDown className="h-2 w-2 fill-[#9E9E9E] text-[#9E9E9E]" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="h-[53px] px-4 text-white font-bold text-sm uppercase font-inter">
                    Language
                  </TableHead>
                  <TableHead className="h-[53px] px-4 text-white font-bold text-sm uppercase font-inter text-center">
                    Options
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((publisher, index) => (
                  <TableRow
                    key={publisher.id}
                    className={`
                      h-[65px] border-0
                      ${index % 2 === 0 ? 'bg-promag-background' : 'bg-white'}
                      hover:bg-gray-50
                    `}
                  >
                    <TableCell className="px-4 pl-9 text-sm font-inter text-promag-body">
                      {publisher.name}
                    </TableCell>
                    <TableCell className="px-4 text-sm font-inter text-promag-body">
                      {publisher.phone}
                    </TableCell>
                    <TableCell className="px-4 text-sm font-inter text-promag-body">
                      {publisher.email}
                    </TableCell>
                    <TableCell className="px-4 text-sm font-inter text-promag-body">
                      {publisher.language}
                    </TableCell>
                    <TableCell className="px-4 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(publisher.id)}
                          className="h-8 w-8 p-0 hover:bg-transparent"
                        >
                          <Edit className="h-5 w-5 text-promag-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(publisher.id)}
                          className="h-8 w-8 p-0 hover:bg-transparent"
                        >
                          <Trash2 className="h-5 w-5 text-[#D9534F]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            </div>
            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-[14px] border-t border-[#DDD] bg-white gap-4 sm:gap-0">
              <div className="flex flex-col sm:flex-row items-center gap-[10px]">
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="w-auto h-[33px] px-[15px] border border-[#DEE6ED] rounded-lg bg-white">
                    <SelectValue>
                      <span className="text-sm font-inter text-promag-body">
                        Show: <span className="font-bold">{pageSize}</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Show: 5</SelectItem>
                    <SelectItem value="10">Show: 10</SelectItem>
                    <SelectItem value="20">Show: 20</SelectItem>
                    <SelectItem value="50">Show: 50</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="text-sm font-inter text-promag-body">
                  Page <span className="font-bold">{currentPage} of {totalPages}</span>
                </div>
              </div>

              <div className="flex items-center flex-wrap">
                {/* First Page / Previous Page */}
                <PaginationButton
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="rounded-l-lg"
                >
                  <div className="flex">
                    <ChevronDown className="h-3 w-3 rotate-90" />
                    <ChevronDown className="h-3 w-3 rotate-90 -ml-1" />
                  </div>
                </PaginationButton>
                
                {/* Previous Page */}
                <PaginationButton
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronDown className="h-3 w-3 rotate-90" />
                </PaginationButton>

                {/* Page Numbers */}
                <PaginationButton
                  isActive={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </PaginationButton>

                {totalPages > 1 && (
                  <PaginationButton
                    isActive={currentPage === 2}
                    onClick={() => setCurrentPage(2)}
                  >
                    2
                  </PaginationButton>
                )}

                {/* Next Page */}
                <PaginationButton
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronDown className="h-3 w-3 -rotate-90" />
                </PaginationButton>

                {/* Last Page / Next Page */}
                <PaginationButton
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="rounded-r-lg"
                >
                  <div className="flex">
                    <ChevronDown className="h-3 w-3 -rotate-90" />
                    <ChevronDown className="h-3 w-3 -rotate-90 -ml-1" />
                  </div>
                </PaginationButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

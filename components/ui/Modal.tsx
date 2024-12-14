"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import React from "react";
import { AlertTriangle, Cpu, X } from "lucide-react";

interface CyberModalProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CyberModal: React.FC<CyberModalProps> = ({ 
  title, 
  message, 
  confirmText, 
  cancelText, 
  onConfirm, 
  onCancel 
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onCancel();
  };

  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className="w-full max-w-md transform overflow-hidden 
                rounded-2xl bg-gradient-to-br from-gray-900 to-cyan-900/50 
                p-6 text-left align-middle shadow-cyber 
                border border-cyan-500/30 relative"
              >
                {/* Close Button */}
                <button 
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-cyan-300 hover:text-cyan-100 
                  transition-colors duration-300 group"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>

                {/* Modal Content */}
                <div className="flex items-start space-x-4">
                  <div className="bg-red-500/20 p-3 rounded-full">
                    <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
                  </div>
                  <div>
                    <Dialog.Title 
                      as="h3" 
                      className="text-2xl font-bold text-transparent bg-clip-text 
                      bg-gradient-to-r from-cyan-400 to-blue-600 mb-2"
                    >
                      {title}
                    </Dialog.Title>
                    <p className="text-cyan-200 text-base mb-6">
                      {message}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-3">
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="flex-1 inline-flex justify-center items-center rounded-lg 
                    bg-cyan-600/30 text-cyan-200 hover:bg-cyan-500/40 
                    px-4 py-2 border border-cyan-500/30 
                    transition-all duration-300 group"
                  >
                    <Cpu className="w-5 h-5 mr-2 group-hover:animate-spin" />
                    {confirmText}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 inline-flex justify-center items-center rounded-lg 
                    bg-gray-800/50 text-cyan-300 hover:bg-gray-700/60 
                    px-4 py-2 border border-cyan-500/20 
                    transition-all duration-300 group"
                  >
                    <X className="w-5 h-5 mr-2 group-hover:rotate-180" />
                    {cancelText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CyberModal;
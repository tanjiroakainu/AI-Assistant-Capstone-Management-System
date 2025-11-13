import { useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import { groupService } from '../services/groupService';

interface ChatMessage {
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'bot',
      content: 'Hello! I\'m your system assistant. I can show you information about our Capstone Management System. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [systemStats, setSystemStats] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load system statistics
    try {
      const allUsers = authService.getAllUsers();
      const allGroups = groupService.getAllGroups();
      
      const stats = {
        totalUsers: allUsers.length,
        totalGroups: allGroups.length,
        students: allUsers.filter(u => u.role === 'student').length,
        teachers: allUsers.filter(u => u.role === 'teacher').length,
        admins: allUsers.filter(u => u.role === 'admin').length,
        approvedGroups: allGroups.filter(g => g.status === 'approved').length,
        pendingGroups: allGroups.filter(g => g.status === 'pending').length,
        inProgressGroups: allGroups.filter(g => g.status === 'in_progress').length,
        completedGroups: allGroups.filter(g => g.status === 'completed').length
      };
      
      setSystemStats(stats);
    } catch (error) {
      console.error('Error loading system stats:', error);
      setSystemStats({
        totalUsers: 0,
        totalGroups: 0,
        students: 0,
        teachers: 0,
        admins: 0,
        approvedGroups: 0,
        pendingGroups: 0,
        inProgressGroups: 0,
        completedGroups: 0
      });
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const handleChoiceSelect = (choice: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      type: 'user',
      content: choice,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Generate bot response based on choice
    let botResponse = '';
    
    if (!systemStats) {
      botResponse = 'Loading system data...';
    } else {
      switch (choice) {
        case 'Total Users':
          botResponse = `Our system currently has **${systemStats.totalUsers}** registered users, including:\n• ${systemStats.students} Students\n• ${systemStats.teachers} Teachers\n• ${systemStats.admins} Administrators`;
          break;
        case 'Total Groups':
          botResponse = `There are **${systemStats.totalGroups}** capstone groups in the system:\n• ${systemStats.approvedGroups} Approved\n• ${systemStats.pendingGroups} Pending\n• ${systemStats.inProgressGroups} In Progress\n• ${systemStats.completedGroups} Completed`;
          break;
        case 'Student Information':
          botResponse = `We have **${systemStats.students}** registered students in our system. Students can:\n• Create capstone project groups\n• Upload proposal PDFs\n• Collaborate with peers and teachers\n• Track their progress with analytics`;
          break;
        case 'Teacher Information':
          botResponse = `Our platform has **${systemStats.teachers}** teachers who can:\n• View all students and their groups\n• Approve or reject proposals\n• Monitor student progress\n• Access comprehensive analytics`;
          break;
        case 'System Features':
          botResponse = `Our Capstone Management System offers:\n\n📊 **Analytics & Charts** - Track activity trends\n👥 **Group Management** - Create and manage projects\n📄 **PDF Proposals** - Upload and review proposals\n🔐 **Secure Access** - Role-based authentication\n📈 **Progress Tracking** - Monitor performance\n✅ **Status Management** - Track proposal statuses`;
          break;
        case 'How to Get Started':
          botResponse = `Getting started is easy!\n\n1. **Students**: Click "Get Started" to register\n2. **Teachers/Admins**: Contact your administrator for account access\n3. Once registered, you can:\n   • Create or join groups\n   • Upload proposal PDFs\n   • Track your progress\n   • View analytics`;
          break;
        default:
          botResponse = 'I can help you with information about our system. Please select one of the options above.';
      }
    }

    // Add bot response after a short delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const choices = [
    'Total Users',
    'Total Groups',
    'Student Information',
    'Teacher Information',
    'System Features',
    'How to Get Started'
  ];

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 z-50 bg-gradient-to-r from-ruby-600 to-ruby-700 hover:from-ruby-700 hover:to-ruby-800 active:from-ruby-800 active:to-ruby-900 text-white rounded-full p-3 sm:p-3.5 md:p-4 shadow-lg hover:shadow-ruby-glow active:shadow-md transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95 touch-manipulation border-2 border-white/20"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-white text-ruby-600 text-[10px] sm:text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse border-2 border-ruby-600 shadow-lg">
            1
          </span>
        )}
      </button>

      {/* Chatbot Panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed bottom-14 sm:bottom-16 md:bottom-20 lg:bottom-24 right-2 sm:right-3 md:right-4 lg:right-6 z-50 w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)] md:w-96 lg:w-[28rem] xl:w-[32rem] max-w-full h-[calc(100vh-4.5rem)] sm:h-[500px] md:h-[550px] lg:h-[600px] max-h-[85vh] sm:max-h-[600px] bg-white rounded-lg sm:rounded-xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-ruby-600 to-ruby-700 text-white p-3 sm:p-4 rounded-t-lg sm:rounded-t-xl flex justify-between items-center flex-shrink-0 border-b-2 border-ruby-800">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md border-2 border-ruby-300">
                <span className="text-ruby-600 text-base sm:text-lg md:text-xl">🤖</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-xs sm:text-sm md:text-base truncate text-white">System Assistant</h3>
                <p className="text-[10px] sm:text-xs text-white/90 font-medium">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 active:text-gray-300 transition-colors p-1 sm:p-1.5 flex-shrink-0 touch-manipulation"
              aria-label="Close chatbot"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 md:space-y-4 bg-gray-900/50 custom-scrollbar">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-3.5 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-ruby-600 to-ruby-700 text-white shadow-md'
                      : 'bg-gray-800 text-white shadow-sm border-2 border-gray-700'
                  }`}
                >
                  <div className="text-[11px] sm:text-xs md:text-sm whitespace-pre-line leading-relaxed sm:leading-relaxed break-words">
                    {message.content.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs mt-1.5 sm:mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Choices Section */}
          <div className="border-t-2 border-gray-700 bg-gray-800 p-2 sm:p-3 md:p-4 flex-shrink-0">
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-300 mb-1.5 sm:mb-2 md:mb-3 font-medium px-1">Select an option to learn more:</p>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 max-h-40 sm:max-h-44 md:max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoiceSelect(choice)}
                  className="text-left px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm bg-gray-900/50 hover:bg-ruby-900/50 active:bg-ruby-900/70 text-white hover:text-ruby-300 active:text-ruby-200 rounded-md sm:rounded-lg transition-all duration-200 border-2 border-gray-700 hover:border-ruby-600 active:border-ruby-500 hover:shadow-sm active:scale-[0.98] touch-manipulation font-medium"
                >
                  <span className="block truncate">{choice}</span>
                </button>
              ))}
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 mt-1.5 sm:mt-2 text-center italic px-1">
              💡 Select an option above to get information
            </p>
          </div>
          </div>
        </>
      )}
    </>
  );
};


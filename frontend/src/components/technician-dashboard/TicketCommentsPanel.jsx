import React, { useState, useEffect } from 'react';
import { BiCommentDetail, BiSend, BiTrash, BiEditAlt } from 'react-icons/bi';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const TicketCommentsPanel = ({ ticketId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock fetching comments
    const mockComments = [
      { id: 101, author: 'Alice Admin', text: 'Technician assigned. Please check the ventilation system.', timestamp: '2 hours ago' },
      { id: 102, author: user, text: 'Heading to the site now.', timestamp: '1 hour ago' },
    ];
    setComments(mockComments);
  }, [ticketId, user]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      // Real API: await axiosInstance.post(`/tickets/${ticketId}/comments`, { text: newComment });
      const commentObj = {
        id: Date.now(),
        author: user,
        text: newComment,
        timestamp: 'Just now'
      };
      setComments([...comments, commentObj]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div className="d-flex flex-column h-100">
      <h3 className="h6 fw-bold text-secondary text-uppercase mb-4 tracking-wider d-flex align-items-center gap-2">
        <BiCommentDetail /> Discussion Thread
      </h3>

      <div className="flex-grow-1 overflow-auto mb-4 pe-2 custom-scrollbar" style={{ minHeight: '300px' }}>
        <div className="d-flex flex-column gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className={`p-3 rounded-4 border ${comment.author === user ? 'bg-primary bg-opacity-10 border-primary border-opacity-10 ms-4' : 'bg-dark bg-opacity-50 border-white border-opacity-5 me-4'}`}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className={`fw-bold small ${comment.author === user ? 'text-primary' : 'text-secondary'}`}>{comment.author}</span>
                <span className="text-secondary opacity-50 small" style={{ fontSize: '0.65rem' }}>{comment.timestamp}</span>
              </div>
              <p className="text-white small mb-0">{comment.text}</p>
              {comment.author === user && (
                <div className="d-flex justify-content-end gap-2 mt-2 opacity-50 hover-opacity-100 transition-all">
                  <button className="btn btn-link p-0 text-secondary" style={{ fontSize: '0.75rem' }}><BiEditAlt /></button>
                  <button className="btn btn-link p-0 text-danger" onClick={() => handleDelete(comment.id)} style={{ fontSize: '0.75rem' }}><BiTrash /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="input-group bg-dark bg-opacity-50 rounded-4 border border-white border-opacity-10 p-2">
          <textarea 
            className="form-control bg-transparent border-0 text-white shadow-none placeholder-secondary small" 
            placeholder="Add a comment or update..."
            rows="2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button 
            className="btn btn-primary rounded-3 align-self-end ms-2 d-flex align-items-center justify-content-center" 
            style={{ width: '40px', height: '40px' }}
            onClick={handlePostComment}
            disabled={loading || !newComment.trim()}
          >
            <BiSend size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .hover-opacity-100:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default TicketCommentsPanel;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  Users, Trophy, Heart, MessageSquare, Bookmark, Send,
  Hash, Code2, Lightbulb, Award,
  Briefcase, Github, ExternalLink,
  ChevronUp, Check, TrendingUp, Zap, Star, ArrowUpRight, Trash2
} from 'lucide-react';

const DOMAIN_COLORS: Record<string, string> = {
  'Software Development': '#00D4FF', 'AI/ML': '#7C3AED', 'Design': '#F59E0B',
  'Marketing': '#EC4899', 'Business': '#10B981', 'Data': '#3B82F6',
  'DevOps': '#EF4444', 'Mobile': '#06B6D4', 'Cybersecurity': '#8B5CF6', 'General': '#94A3B8'
};

const TYPE_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  'Discussion': { color: '#00D4FF', icon: MessageSquare, label: 'Discussion' },
  'Doubt': { color: '#F59E0B', icon: Lightbulb, label: 'Doubt' },
  'Project': { color: '#10B981', icon: Code2, label: 'Project Showcase' },
  'Achievement': { color: '#7C3AED', icon: Award, label: 'Achievement' },
  'Opportunity': { color: '#3B82F6', icon: Briefcase, label: 'Opportunity' },
  'Collaboration': { color: '#EC4899', icon: Users, label: 'Collaboration' }
};

// ── Create Post Component ──
function CreatePostBox({ onPost }: { onPost: () => void }) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({
    content: '', postType: 'Discussion', domainTag: 'General',
    tags: '', githubLink: '', demoLink: '', visibility: 'Public'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.content.trim()) { toast.error('Write something first!'); return; }
    if (form.postType === 'Project' && !form.githubLink) { toast.error('GitHub link required for Projects'); return; }
    try {
      setSubmitting(true);
      const res = await api.createCommunityPost({
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        domainTag: form.domainTag || user?.primaryDomain || 'General'
      });
      if (res.success) {
        toast.success('Post published! +5 XP');
        setForm({ content: '', postType: 'Discussion', domainTag: 'General', tags: '', githubLink: '', demoLink: '', visibility: 'Public' });
        setExpanded(false);
        onPost();
      }
    } catch (err: any) { toast.error(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981] to-[#00D4FF] flex items-center justify-center text-white text-sm font-bold shrink-0">
          {user?.name?.[0] || '?'}
        </div>
        <div className="flex-1">
          <textarea
            value={form.content}
            onChange={e => { setForm(f => ({ ...f, content: e.target.value })); if (!expanded) setExpanded(true); }}
            placeholder="Share a project, ask a doubt, or post an achievement..."
            className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder:text-[#64748B] min-h-[44px]"
            rows={expanded ? 4 : 2}
          />
          {expanded && (
            <div className="space-y-3 mt-3 pt-3 border-t border-white/5">
              {/* Post Type */}
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(TYPE_CONFIG).map(([key, conf]) => {
                  const Icon = conf.icon;
                  return (
                    <button key={key} onClick={() => setForm(f => ({ ...f, postType: key }))}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${form.postType === key ? 'border' : 'bg-white/5 text-[#94A3B8]'}`}
                      style={form.postType === key ? { background: `${conf.color}15`, color: conf.color, borderColor: `${conf.color}30` } : {}}>
                      <Icon size={11} /> {key}
                    </button>
                  );
                })}
              </div>
              {/* Domain & Tags */}
              <div className="grid grid-cols-2 gap-2">
                <select value={form.domainTag} onChange={e => setForm(f => ({ ...f, domainTag: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none">
                  {Object.keys(DOMAIN_COLORS).map(d => <option key={d} value={d} className="bg-[#0A0E1A]">{d}</option>)}
                </select>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  placeholder="Tags (comma separated)" />
              </div>
              {/* GitHub / Demo links */}
              {(form.postType === 'Project' || form.postType === 'Collaboration') && (
                <div className="grid grid-cols-2 gap-2">
                  <input value={form.githubLink} onChange={e => setForm(f => ({ ...f, githubLink: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                    placeholder="GitHub URL *" />
                  <input value={form.demoLink} onChange={e => setForm(f => ({ ...f, demoLink: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                    placeholder="Demo URL (optional)" />
                </div>
              )}
              {/* Visibility & Submit */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['Public', 'Private'].map(v => (
                    <button key={v} onClick={() => setForm(f => ({ ...f, visibility: v }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${form.visibility === v ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-white/5 text-[#64748B]'}`}>
                      {v}
                    </button>
                  ))}
                </div>
                <button onClick={handleSubmit} disabled={submitting}
                  className="px-5 py-2 bg-[#10B981] hover:bg-[#10B981]/80 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50">
                  <Send size={14} /> {submitting ? 'Posting...' : 'Publish'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Post Card with interactions ──
function PostCard({ post, onRefresh }: { post: any; onRefresh: () => void }) {
  const { user } = useAuth();
  const typeConf = TYPE_CONFIG[post.postType] || TYPE_CONFIG['Discussion'];
  const TypeIcon = typeConf.icon;
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [saved, setSaved] = useState(post.isSaved || false);

  const handleLike = async () => {
    try {
      const res = await api.togglePostLike(post._id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err: any) { toast.error(err.message); }
  };

  const handleSave = async () => {
    try {
      const res = await api.togglePostSave(post._id);
      setSaved(res.saved);
      toast.success(res.saved ? 'Post saved' : 'Post unsaved');
    } catch (err: any) { toast.error(err.message); }
  };

  const loadComments = async () => {
    try {
      const res = await api.getPostComments(post._id);
      if (res.success) setComments(res.comments);
    } catch (e) { console.error(e); }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await api.addPostComment(post._id, commentText);
      if (res.success) {
        setCommentText('');
        loadComments();
        onRefresh();
      }
    } catch (err: any) { toast.error(err.message); }
  };

  const handleUpvote = async (commentId: string) => {
    try {
      await api.upvoteComment(commentId);
      loadComments();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleAcceptAnswer = async (commentId: string) => {
    try {
      await api.acceptAnswer(commentId);
      toast.success('Answer accepted! +15 XP to the author');
      loadComments();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.deleteCommunityPost(post._id);
      toast.success('Post deleted');
      onRefresh();
    } catch (err: any) { toast.error(err.message); }
  };

  const toggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  const author = post.authorId || {};
  const isOwner = author._id === user?.id;

  return (
    <div className="glass-card p-5">
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C3AED] flex items-center justify-center text-white text-sm font-bold shrink-0">
          {author.name?.[0] || '?'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white font-bold">{author.name}</span>
            {(author.communityScore || 0) > 50 && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#F59E0B]/20 text-[#F59E0B]">⭐ {author.communityScore}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
            <span style={{ color: DOMAIN_COLORS[author.primaryDomain] || '#64748B' }}>{author.primaryDomain || 'Student'}</span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"
            style={{ background: `${typeConf.color}15`, color: typeConf.color }}>
            <TypeIcon size={12} /> {post.postType}
          </span>
          {isOwner && (
            <button onClick={handleDelete} className="text-[#EF4444]/50 hover:text-[#EF4444] transition-colors"><Trash2 size={14} /></button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-[#CBD5E1] leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

      {/* Links */}
      {(post.githubLink || post.demoLink) && (
        <div className="flex gap-2 mb-3">
          {post.githubLink && (
            <a href={post.githubLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-xs text-[#94A3B8] hover:text-white transition-colors">
              <Github size={14} /> Repository
            </a>
          )}
          {post.demoLink && (
            <a href={post.demoLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-xs text-[#94A3B8] hover:text-white transition-colors">
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
        </div>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag: string) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#94A3B8]">
              <Hash size={9} className="inline mr-0.5" />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-white/5">
        <button onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${liked ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'text-[#64748B] hover:bg-white/5 hover:text-white'}`}>
          <Heart size={15} fill={liked ? '#EF4444' : 'none'} /> {likesCount}
        </button>
        <button onClick={toggleComments}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${showComments ? 'bg-[#00D4FF]/10 text-[#00D4FF]' : 'text-[#64748B] hover:bg-white/5 hover:text-white'}`}>
          <MessageSquare size={15} /> {post.commentsCount || 0}
        </button>
        <button onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${saved ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'text-[#64748B] hover:bg-white/5 hover:text-white'}`}>
          <Bookmark size={15} fill={saved ? '#F59E0B' : 'none'} />
        </button>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full"
          style={{ background: `${DOMAIN_COLORS[post.domainTag] || '#64748B'}15`, color: DOMAIN_COLORS[post.domainTag] || '#64748B' }}>
          {post.domainTag}
        </span>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
          {comments.map((c: any) => (
            <div key={c._id} className={`flex gap-3 p-3 rounded-xl ${c.isAcceptedAnswer ? 'bg-[#10B981]/5 border border-[#10B981]/20' : 'bg-white/[0.02]'}`}>
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                {c.userId?.name?.[0] || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white font-bold">{c.userId?.name}</span>
                  {c.isAcceptedAnswer && <span className="text-[9px] px-1.5 py-0.5 bg-[#10B981]/20 text-[#10B981] rounded font-bold">✓ Accepted</span>}
                </div>
                <p className="text-xs text-[#CBD5E1] mt-1">{c.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => handleUpvote(c._id)} className="text-[10px] text-[#64748B] hover:text-white flex items-center gap-1">
                    <ChevronUp size={12} /> {c.upvoteCount || 0}
                  </button>
                  {isOwner && post.postType === 'Doubt' && !c.isAcceptedAnswer && (
                    <button onClick={() => handleAcceptAnswer(c._id)} className="text-[10px] text-[#10B981] hover:underline flex items-center gap-1">
                      <Check size={12} /> Accept Answer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Add comment */}
          <div className="flex gap-2">
            <input value={commentText} onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleComment()}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#10B981]/50"
              placeholder="Write a comment..." />
            <button onClick={handleComment}
              className="px-4 py-2.5 bg-[#10B981] text-white rounded-xl text-xs font-bold hover:bg-[#10B981]/80 transition-all">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ──
export default function CommunityDashboard() {
  useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      let params = '?';
      if (selectedDomain) params += `domain=${selectedDomain}&`;
      if (selectedType) params += `type=${selectedType}&`;

      const [feedRes, statsRes, leaderRes] = await Promise.all([
        api.getCommunityFeed(params),
        api.getCommunityStats(),
        api.getCommunityLeaderboard()
      ]);

      if (feedRes.success) {
        setPosts(feedRes.posts);
        setTrendingTags(feedRes.trendingTags || []);
      }
      if (statsRes.success) setStats(statsRes.stats);
      if (leaderRes.success) setLeaders(leaderRes.leaderboard || []);
    } catch (err) {
      console.error('Community feed error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDomain, selectedType]);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={24} className="text-[#10B981]" /> Community
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">Share knowledge, showcase projects, and grow your reputation</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Community Score', value: stats.communityScore || 0, icon: Zap, color: '#10B981' },
            { label: 'My Posts', value: stats.myPosts || 0, icon: MessageSquare, color: '#00D4FF' },
            { label: 'Total Posts', value: stats.totalPosts || 0, icon: Users, color: '#7C3AED' },
            { label: 'This Week', value: stats.thisWeekPosts || 0, icon: TrendingUp, color: '#F59E0B' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <Icon size={16} style={{ color: s.color }} />
                  <ArrowUpRight size={12} className="text-white/20" />
                </div>
                <p className="text-xl font-bold text-white mt-2">{s.value}</p>
                <p className="text-[10px] text-[#94A3B8] font-medium">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => { setSelectedDomain(''); setSelectedType(''); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${!selectedDomain && !selectedType ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-white/5 text-[#64748B]'}`}>
            All
          </button>
          {Object.entries(TYPE_CONFIG).map(([key, conf]) => {
            const Icon = conf.icon;
            return (
              <button key={key} onClick={() => setSelectedType(selectedType === key ? '' : key)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${selectedType === key ? 'border' : 'bg-white/5 text-[#64748B]'}`}
                style={selectedType === key ? { background: `${conf.color}15`, color: conf.color, borderColor: `${conf.color}30` } : {}}>
                <Icon size={11} /> {key}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed */}
          <div className="lg:col-span-2 space-y-4">
            <CreatePostBox onPost={fetchFeed} />
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />)
            ) : posts.length > 0 ? (
              posts.map(p => <PostCard key={p._id} post={p} onRefresh={fetchFeed} />)
            ) : (
              <div className="glass-card p-12 text-center">
                <MessageSquare size={40} className="text-[#64748B] mx-auto mb-3" />
                <h3 className="text-white font-bold">No posts yet</h3>
                <p className="text-sm text-[#64748B] mt-1">Be the first to share something!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* My Score */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Your Reputation</h3>
                <Star size={16} className="text-[#F59E0B]" />
              </div>
              <div className="text-center py-3">
                <p className="text-4xl font-bold text-white">{stats.communityScore || 0}</p>
                <p className="text-sm text-[#94A3B8] mt-1">Community Score</p>
              </div>
              <div className="space-y-1.5 mt-3 text-xs">
                <div className="flex justify-between text-[#64748B]"><span>Create post</span><span className="text-[#10B981]">+5</span></div>
                <div className="flex justify-between text-[#64748B]"><span>Like received</span><span className="text-[#10B981]">+2</span></div>
                <div className="flex justify-between text-[#64748B]"><span>Helpful answer</span><span className="text-[#10B981]">+10</span></div>
                <div className="flex justify-between text-[#64748B]"><span>Accepted answer</span><span className="text-[#10B981]">+15</span></div>
                <div className="flex justify-between text-[#64748B]"><span>Project showcase</span><span className="text-[#10B981]">+20</span></div>
              </div>
            </div>

            {/* Trending Tags */}
            {trendingTags.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-[#00D4FF]" /> Trending</h3>
                <div className="space-y-2">
                  {trendingTags.slice(0, 8).map((t: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm text-[#94A3B8]">
                      <span className="flex items-center gap-1.5"><Hash size={12} className="text-[#00D4FF]" /> {t.tag}</span>
                      <span className="text-[10px] text-[#64748B]">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            <div className="glass-card p-5">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Trophy size={14} className="text-[#F59E0B]" /> Top Contributors</h3>
              <div className="space-y-2">
                {leaders.slice(0, 6).map((s: any, i: number) => (
                  <div key={s._id} className="flex items-center gap-2.5 py-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${i < 3 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-white/5 text-[#64748B]'}`}>{i + 1}</span>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C3AED] flex items-center justify-center text-[9px] text-white font-bold">{s.name?.[0]}</div>
                    <span className="text-xs text-white font-medium flex-1 truncate">{s.name}</span>
                    <span className="text-[10px] text-[#F59E0B] font-bold">{s.communityScore}</span>
                  </div>
                ))}
                {leaders.length === 0 && <p className="text-xs text-[#64748B] text-center py-4">No contributors yet</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

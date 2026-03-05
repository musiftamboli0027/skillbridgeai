/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MainLayout } from '../components/MainLayout';
import {
  Users, Trophy, Code2,
  Briefcase, MessageSquare,
  Heart, Github, ExternalLink, Filter, Hash,
  Globe2, Rocket, ArrowRight, Lightbulb, Award, TrendingUp
} from 'lucide-react';

const DOMAIN_COLORS: Record<string, string> = {
  'Software Development': '#00D4FF', 'AI/ML': '#7C3AED', 'Design': '#F59E0B',
  'Marketing': '#EC4899', 'Business': '#10B981', 'Data': '#3B82F6',
  'DevOps': '#EF4444', 'Mobile': '#06B6D4', 'Cybersecurity': '#8B5CF6', 'General': '#94A3B8'
};

const TYPE_CONFIG: Record<string, { color: string; icon: any }> = {
  'Discussion': { color: '#00D4FF', icon: MessageSquare },
  'Doubt': { color: '#F59E0B', icon: Lightbulb },
  'Project': { color: '#10B981', icon: Code2 },
  'Achievement': { color: '#7C3AED', icon: Award },
  'Opportunity': { color: '#3B82F6', icon: Briefcase },
  'Collaboration': { color: '#EC4899', icon: Users }
};

const DOMAINS = ['All', 'Software Development', 'AI/ML', 'Design', 'Marketing', 'Business', 'Data', 'DevOps', 'Mobile', 'Cybersecurity'];

function PostCard({ post }: { post: any }) {
  const typeConf = TYPE_CONFIG[post.postType] || TYPE_CONFIG['Discussion'];
  const TypeIcon = typeConf.icon;

  return (
    <div className="bg-[#0A0E1A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C3AED] flex items-center justify-center text-white text-sm font-bold shrink-0">
          {post.author?.name?.[0] || '?'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white font-bold truncate">{post.author?.name}</span>
            {post.author?.score > 50 && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#F59E0B]/20 text-[#F59E0B]">⭐ {post.author.score}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
            <span style={{ color: DOMAIN_COLORS[post.author?.domain] || '#64748B' }}>{post.author?.domain || 'Student'}</span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"
          style={{ background: `${typeConf.color}15`, color: typeConf.color }}>
          <TypeIcon size={12} /> {post.postType}
        </span>
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

      {/* Footer */}
      <div className="flex items-center gap-4 pt-3 border-t border-white/5">
        <span className="flex items-center gap-1 text-xs text-[#64748B]"><Heart size={14} /> {post.likesCount || 0}</span>
        <span className="flex items-center gap-1 text-xs text-[#64748B]"><MessageSquare size={14} /> {post.commentsCount || 0}</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full"
          style={{ background: `${DOMAIN_COLORS[post.domainTag] || '#64748B'}15`, color: DOMAIN_COLORS[post.domainTag] || '#64748B' }}>
          {post.domainTag}
        </span>
      </div>
    </div>
  );
}

export default function CommunityPublic() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let params = '?';
        if (selectedDomain !== 'All') params += `domain=${selectedDomain}&`;
        if (selectedType) params += `type=${selectedType}&`;

        const [feedRes, leaderRes] = await Promise.all([
          api.getCommunityPublicFeed(params),
          api.getCommunityLeaderboard()
        ]);

        if (feedRes.success) {
          setPosts(feedRes.posts);
          setTrendingTags(feedRes.trendingTags || []);
        }
        if (leaderRes.success) setLeaders(leaderRes.leaderboard || []);
      } catch (err) {
        console.error('Community fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDomain, selectedType]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#03040A]">
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full text-sm text-[#10B981] font-bold mb-6">
                <Globe2 size={16} /> Professional Student Network
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                SkillBridge <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#00D4FF]">Community</span>
              </h1>
              <p className="text-[#94A3B8] mt-4 text-lg max-w-xl mx-auto">
                Where students showcase projects, solve doubts, and build cross-domain connections.
              </p>
              <button onClick={() => navigate('/login')}
                className="mt-8 px-8 py-3.5 bg-gradient-to-r from-[#10B981] to-[#00D4FF] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#10B981]/20 inline-flex items-center gap-2">
                Join SkillBridge to Collaborate <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[150px] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Domain Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {DOMAINS.map(d => (
              <button key={d} onClick={() => setSelectedDomain(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedDomain === d ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20' : 'bg-white/5 text-[#94A3B8] border border-white/5 hover:border-white/15'}`}>
                {d}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <button onClick={() => setSelectedType('')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${!selectedType ? 'bg-white/10 text-white' : 'bg-white/5 text-[#64748B] hover:text-white'}`}>
              <Filter size={12} className="inline mr-1" /> All Types
            </button>
            {Object.entries(TYPE_CONFIG).map(([type, conf]) => {
              const Icon = conf.icon;
              return (
                <button key={type} onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${selectedType === type ? `border` : 'bg-white/5 text-[#64748B] hover:text-white'}`}
                  style={selectedType === type ? { background: `${conf.color}15`, color: conf.color, borderColor: `${conf.color}30` } : {}}>
                  <Icon size={12} /> {type}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feed */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />)
              ) : posts.length > 0 ? (
                posts.map(p => <PostCard key={p._id} post={p} />)
              ) : (
                <div className="bg-[#0A0E1A] border border-white/5 rounded-2xl p-12 text-center">
                  <MessageSquare size={40} className="text-[#64748B] mx-auto mb-3" />
                  <h3 className="text-white font-bold">No posts yet</h3>
                  <p className="text-sm text-[#64748B] mt-1">Be the first to share something with the community!</p>
                  <button onClick={() => navigate('/login')}
                    className="mt-4 px-6 py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-bold hover:bg-[#10B981]/80 transition-all">
                    Join & Post
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* CTA */}
              <div className="bg-gradient-to-br from-[#10B981]/10 to-[#00D4FF]/5 border border-[#10B981]/20 rounded-2xl p-5 text-center">
                <Rocket size={28} className="text-[#10B981] mx-auto mb-2" />
                <h3 className="text-white font-bold">Join the Community</h3>
                <p className="text-xs text-[#94A3B8] mt-1">Create posts, collaborate, and build your profile</p>
                <button onClick={() => navigate('/register')}
                  className="mt-3 w-full py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-bold hover:bg-[#10B981]/80 transition-all">
                  Sign Up Free
                </button>
              </div>

              {/* Trending Tags */}
              {trendingTags.length > 0 && (
                <div className="bg-[#0A0E1A] border border-white/5 rounded-2xl p-5">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-[#00D4FF]" /> Trending</h3>
                  <div className="space-y-2">
                    {trendingTags.map((t: any, i: number) => (
                      <button key={i} onClick={() => setSelectedDomain('All')}
                        className="w-full flex items-center justify-between py-1.5 text-sm text-[#94A3B8] hover:text-white transition-colors">
                        <span className="flex items-center gap-2"><Hash size={14} className="text-[#00D4FF]" /> {t.tag}</span>
                        <span className="text-[10px] text-[#64748B]">{t.count} posts</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Leaderboard */}
              <div className="bg-[#0A0E1A] border border-white/5 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Trophy size={16} className="text-[#F59E0B]" /> Top Contributors</h3>
                <div className="space-y-2">
                  {leaders.slice(0, 8).map((s: any, i: number) => (
                    <div key={s._id} className="flex items-center gap-3 py-1.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 3 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-white/5 text-[#64748B]'}`}>{i + 1}</span>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C3AED] flex items-center justify-center text-[10px] text-white font-bold">{s.name?.[0]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{s.name}</p>
                        <p className="text-[10px]" style={{ color: DOMAIN_COLORS[s.primaryDomain] || '#64748B' }}>{s.primaryDomain || 'Student'}</p>
                      </div>
                      <span className="text-xs text-[#F59E0B] font-bold">{s.communityScore}</span>
                    </div>
                  ))}
                </div>
                {leaders.length === 0 && <p className="text-sm text-[#64748B] text-center py-4">No contributors yet</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

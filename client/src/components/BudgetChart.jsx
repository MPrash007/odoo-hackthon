import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#22D3EE', '#A78BFA', '#F59E0B', '#F472B6', '#34D399', '#60A5FA', '#FB7185'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10, 14, 28, 0.95)',
        border: '1px solid rgba(148, 163, 184, 0.18)',
        borderRadius: '10px',
        padding: '8px 12px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        fontSize: '12px',
      }}>
        <p style={{ color: '#f1f5f9', fontWeight: 600 }}>{payload[0].name}</p>
        <p style={{ color: '#22D3EE', marginTop: '2px', fontWeight: 700 }}>₹{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const BudgetPieChart = ({ breakdown = {} }) => {
  const data = Object.entries(breakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  if (data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#64748b', fontSize: '13px' }}>
        No expense data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <defs>
          {COLORS.map((c, i) => (
            <linearGradient key={i} id={`pie-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity={1} />
              <stop offset="100%" stopColor={c} stopOpacity={0.6} />
            </linearGradient>
          ))}
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={`url(#pie-grad-${index % COLORS.length})`} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}
          iconType="circle"
          iconSize={9}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const BudgetBarChart = ({ sections = [] }) => {
  const data = sections.map(s => ({
    name: s.title?.length > 12 ? s.title.substring(0, 12) + '…' : s.title,
    Budget: s.budget,
    Spent: s.spent,
  }));

  if (data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#64748b', fontSize: '13px' }}>
        No section data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="bar-budget" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity={1} />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="bar-spent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity={1} />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.06)" />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.10)' }} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.10)' }} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.04)' }} />
        <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }} iconSize={10} />
        <Bar dataKey="Budget" fill="url(#bar-budget)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="Spent" fill="url(#bar-spent)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BudgetPieChart;

import { motion } from 'framer-motion';

export default function DesktopIcons({ apps, onLaunch }) {
  const desktopApps = apps.filter(a => a.showOnDesktop);

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2 z-[5]">
      {desktopApps.map((app, i) => (
        <motion.button
          key={app.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.08 }}
          onDoubleClick={() => onLaunch(app.id)}
          className="flex flex-col items-center gap-1.5 w-20 p-2 rounded-xl hover:bg-white/5 transition-colors group"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg ${app.bgClass}`}>
            <app.icon className={`w-6 h-6 ${app.iconColor}`} />
          </div>
          <span className="text-[10px] text-foreground/70 group-hover:text-foreground transition-colors text-center leading-tight font-inter drop-shadow-lg">
            {app.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
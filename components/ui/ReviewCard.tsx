import Image from "next/image";

interface ReviewCardProps {
  name: string;
  role: string;
  text: string;
  img: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  name,
  role,
  text,
  img,
}) => (
  <div className="group w-[320px] md:w-112.5 p-6 md:p-8 rounded-3xl bg-stone-900/50 border border-stone-800 hover:border-salvia/40 hover:bg-stone-900 transition-all duration-500 shrink-0">
    <div className="flex items-center gap-4 mb-4">
      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0">
        <Image
          src={img}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          alt={name}
        />
      </div>
      <div>
        <p className="sans text-[10px] md:text-xs font-bold uppercase tracking-wider text-white">
          {name}
        </p>
        <p className="serif text-[10px] md:text-xs italic text-stone-500">
          {role}
        </p>
      </div>
    </div>
    <p className="sans text-sm md:text-base text-stone-300 leading-relaxed italic whitespace-normal">
      {`"${text}"`}
    </p>
  </div>
);

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { FC, HtmlHTMLAttributes } from "react";

const variants=cva(
   'active:scale-95 inline-flex justify-center items-center rounded-md text-sm transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
   {
      variants:{
         variant:{
            default:'bg-slate-900 text-white hover:bg-slate-800',
            ghost:'bg-transparent hover:text-scale-900 hover:bg-slate-200'
         },
         size:{
            default:'h-10 py-2 px-4',
            sm:'h-8 px-2',
            lg:'h-11 px-9'
         }
      },
      defaultVariants:{
         variant:'default',
         size:'default'
      }
   }
)

//Interface ButtonProps extends all the properties of an HTML button and the button variants
export interface ButtonProps extends HtmlHTMLAttributes<HTMLButtonElement>, VariantProps<typeof variants> {
   isLoading?:boolean
}

const Button:FC<ButtonProps>=({
   className, 
   variant,
   children,
   isLoading,
   ...props
})=>{
   return (
      <button
         className={cn(variants({variant, size:'default', className}))}
         disabled={isLoading}
         {...props}
      >
         {isLoading?<Loader2 className="mr-3 h-4 w-4 animate-spin"/>:null}
         {children}
      </button>
   )
}

export default Button;
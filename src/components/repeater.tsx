import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/hooks/categories/useCategories";
import { Category } from "@/types/category";
import { Trash2Icon } from "lucide-react";

interface RepeaterItem {
    id: string;
    name: string;
    amount: number;
}

export const Repeater = ({ field }: any) => {
    // Inicializar correctamente con datos del formulario
    const [items, setItems] = useState<RepeaterItem[]>(() => {
        if (field.value && field.value.length > 0) {
            return field.value;
        }
        // Si no hay datos, crear item por defecto y sincronizar inmediatamente
        const defaultItem = { id: crypto.randomUUID(), name: "", amount: 0 };
        // Notificar al formulario sobre el item por defecto
        setTimeout(() => field.onChange([defaultItem]), 0);
        return [defaultItem];
    });

    // Sincronizar cuando cambian los datos del formulario
    useEffect(() => {
        if (field.value && Array.isArray(field.value)) {
            setItems(field.value);
        }
    }, [field.value]);

    const addNewLine = () => {
        const newItem = { id: crypto.randomUUID(), name: "", amount: 0 };
        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        field.onChange(updatedItems);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            const updatedItems = items.filter(item => item.id !== id);
            setItems(updatedItems);
            field.onChange(updatedItems);
        }
    };

    const updateItem = (id: string, updates: any) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, ...updates } : item
        );
        setItems(updatedItems);
        field.onChange(updatedItems);
    };

    return (
        <div className="flex flex-col border rounded-md">
            <div className="gap-4 mb-2 px-2 py-4 space-y-4">
                {items.map((item) => (
                    <RepeaterLine
                        key={item.id}
                        item={item}
                        items={items}
                        onUpdate={(updates) => updateItem(item.id, updates)}
                        onRemove={() => removeItem(item.id)}
                    />
                ))}
            </div>
            <div className="flex justify-center items-center mb-4">
                <Button type="button" onClick={addNewLine} className="text-center">
                    Add New Line
                </Button>
            </div>
        </div>
    )
}


interface RepeaterLineProps {
    item: RepeaterItem;
    items: RepeaterItem[];
    onUpdate: (updates: any) => void;
    onRemove: () => void;
}

const RepeaterLine = ({ item, items, onUpdate, onRemove }: RepeaterLineProps) => {

    const categories = useCategories().allCategories.data || [];

    const handleCategoryChange = (categoryId: string) => {
        const category = categories?.find((cat) => cat.id === categoryId);
        if (category) {
            onUpdate({
                id: categoryId,
                name: category.name,
                amount: item.amount || category.amount || 0
            });
        }
    };

    const handleAmountChange = (amount: number) => {
        onUpdate({ amount });
    };

    return (
        <div className="flex flex-row justify-between items-center gap-4">
            <FormItem className="flex-2">
                <Select onValueChange={handleCategoryChange} value={item.id || ""}>
                    <FormControl>
                        <SelectTrigger className="w-48 h-10">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {categories?.map((category) => (
                            <SelectItem
                                key={category.id}
                                value={category.id}
                                disabled={items.some(i => i.id === category.id && i.id !== item.id)}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>

            <FormItem className="flex-1">
                <FormControl>
                    <Input
                        placeholder="100"
                        type="number"
                        min={0}
                        value={item.amount || ''}
                        onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
            <Button
                disabled={items.length <= 1}
                variant="ghost"
                size="sm"
                onClick={onRemove}
                type="button"
            >
                <Trash2Icon className="text-destructive" />
            </Button>
        </div>
    )
}
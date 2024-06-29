new Vue({
    el: '#app',
    data() {
        return {
            foodCategories: {
                Naturais: [
                    { name: 'Maçã' },
                    { name: 'Banana' }
                ],
                Molhos: [
                    { name: 'Ketchup' },
                    { name: 'Mostarda' }
                ],
                Sais: [
                    { name: 'Sal de Mesa' },
                    { name: 'Sal Marinho' }
                ],
                Tags: [
                    { name: 'Orgânico', quantity: 6 },
                    { name: 'Sem Glúten', quantity: 6 }
                ]
            },
            addedItems: []
        };
    },
    computed: {
        addedItemsByCategory() {
            const categorizedItems = {
                Naturais: [],
                Molhos: [],
                Sais: [],
                Tags: []
            };

            this.addedItems.forEach(item => {
                if (categorizedItems[item.category]) {
                    categorizedItems[item.category].push(item);
                    // Ordenar os itens dentro da categoria
                    categorizedItems[item.category].sort((a, b) => a.name.localeCompare(b.name));
                }
            });

            return categorizedItems;
        }
    },
    methods: {
        addItem(item, category) {
            const existingItem = this.addedItems.find(
                added => added.name === item.name && added.category === category
            );

            if (existingItem) {
                // Scroll suave para o item na lista de itens adicionados
                const listItem = document.getElementById(`item-${existingItem.name}`);
                if (listItem) {
                    listItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                let initialQuantity = 1;
                if (category === 'Tags') {
                    initialQuantity = 6; // Iniciar itens da categoria Tags com 6
                }
                const newItem = { name: item.name, category, quantity: initialQuantity };
                
                // Adicionar campos para quantidade a ser adicionada/subtraída
                newItem.quantityToAdd = 1;
                newItem.quantityToSubtract = 1;

                this.addedItems.push(newItem);

                // Ordenar os itens novamente após adicionar um novo item
                this.addedItems.sort((a, b) => {
                    if (a.category === b.category) {
                        return a.name.localeCompare(b.name);
                    }
                    return a.category.localeCompare(b.category);
                });

                // Scroll suave para o novo item adicionado
                setTimeout(() => {
                    const newItemElement = document.getElementById(`item-${newItem.name}`);
                    if (newItemElement) {
                        newItemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100); // Tempo de espera para garantir que o item foi renderizado
            }
        },
        adjustQuantity(item, category, change) {
            const addedItem = this.addedItems.find(
                added => added.name === item.name && added.category === category
            );

            if (addedItem) {
                addedItem.quantity += change;
            }
        },
        increaseQuantityByInput(item) {
            const addedItem = this.addedItems.find(
                added => added.name === item.name && added.category === item.category
            );

            if (addedItem) {
                addedItem.quantity += addedItem.quantityToAdd;
                addedItem.quantityToAdd = 1; // Resetar campo de entrada
            }
        },
        decreaseBySix(item) {
            const addedItem = this.addedItems.find(
                added => added.name === item.name && added.category === item.category
            );

            if (addedItem && addedItem.quantity > 6) {
                addedItem.quantity -= 6;
            }
        },
        increaseBySix(item) {
            const addedItem = this.addedItems.find(
                added => added.name === item.name && added.category === item.category
            );

            if (addedItem) {
                addedItem.quantity += 6;
            }
        },
        increaseBySixItem(item) {
            const addedItem = this.addedItems.find(
                added => added.name === item.name && added.category === item.category
            );

            if (addedItem) {
                addedItem.quantity += 6;
            }
        },
        enviarPorEmail() {
            const observation = document.getElementById('observationText').value.trim();

            let emailContent = '';
            Object.keys(this.addedItemsByCategory).forEach(category => {
                if (this.addedItemsByCategory[category].length > 0) {
                    emailContent += `${category}:\n`;
                    this.addedItemsByCategory[category].forEach(item => {
                        emailContent += `${item.name}: ${item.quantity}\n`;
                    });
                }
            });

            if (observation !== '') {
                emailContent += `\nObservação:\n${observation}`;
            }

            document.getElementById('emailContent').value = emailContent;
            document.getElementById('observation').value = observation;

            document.getElementById('emailForm').submit();
        }
    }
});
